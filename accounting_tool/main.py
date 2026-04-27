"""
DATEV Jahresabschluss-Prüfer
FastAPI Backend mit KI-gestützter Buchungsanalyse
"""

import json
import os
import uuid
from datetime import datetime
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, File, Form, HTTPException, Request, UploadFile
from fastapi.responses import HTMLResponse, JSONResponse, Response, StreamingResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from ai_analyzer import analyze_bookings, build_account_summaries
from datev_parser import generate_datev_export, parse_file
from models import AnalysisSession, AnomalyAction, ResolveRequest

BASE_DIR = Path(__file__).parent
UPLOAD_DIR = BASE_DIR / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

app = FastAPI(title="DATEV Jahresabschluss-Prüfer", version="1.0.0")
templates = Jinja2Templates(directory=str(BASE_DIR / "templates"))

# In-Memory Session Store (für Produktion: Redis oder DB verwenden)
sessions: dict[str, AnalysisSession] = {}


@app.get("/", response_class=HTMLResponse)
async def root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


@app.post("/api/upload")
async def upload_files(
    current_file: UploadFile = File(...),
    previous_file: Optional[UploadFile] = File(None),
    fiscal_year: str = Form("2024"),
):
    """
    Lädt DATEV-Dateien hoch und startet die Analyse.
    Akzeptiert: CSV, EXTF (DATEV-Format), Excel (.xlsx)
    """
    session_id = str(uuid.uuid4())

    try:
        current_content = await current_file.read()
        current_meta, current_bookings = parse_file(current_content, current_file.filename)

        previous_bookings = None
        prev_filename = None
        if previous_file and previous_file.filename:
            prev_content = await previous_file.read()
            if prev_content:
                _, previous_bookings = parse_file(prev_content, previous_file.filename)
                prev_filename = previous_file.filename

        # Analyse starten
        anomalies, summary, ja_hints = await analyze_bookings(
            current_bookings,
            previous_bookings,
            fiscal_year=fiscal_year,
        )

        from skr_knowledge import detect_skr, compute_account_aggregates
        from ai_analyzer import compute_account_aggregates as caa
        accounts_data = caa(current_bookings)
        skr = detect_skr(list(accounts_data.keys()))
        account_summaries = build_account_summaries(current_bookings, anomalies, skr)

        # Bilanz-Kennzahlen berechnen
        total_revenue = sum(
            d["balance"] for acc, d in accounts_data.items()
            if _is_revenue_account(acc, skr)
        )
        total_expenses = sum(
            d["balance"] for acc, d in accounts_data.items()
            if _is_expense_account(acc, skr)
        )
        total_assets = sum(
            d["balance"] for acc, d in accounts_data.items()
            if _is_asset_account(acc, skr)
        )
        total_liabilities = sum(
            abs(d["balance"]) for acc, d in accounts_data.items()
            if _is_liability_account(acc, skr)
        )

        full_summary = summary
        if ja_hints:
            full_summary += "\n\n**Jahresabschluss-Hinweise:**\n" + "\n".join(f"• {h}" for h in ja_hints)

        session = AnalysisSession(
            session_id=session_id,
            filename_current=current_file.filename,
            filename_previous=prev_filename,
            fiscal_year=fiscal_year,
            accounts=account_summaries,
            anomalies=anomalies,
            analysis_status="completed",
            total_revenue=abs(total_revenue),
            total_expenses=abs(total_expenses),
            total_assets=abs(total_assets),
            total_liabilities=abs(total_liabilities),
            summary_text=full_summary,
        )
        sessions[session_id] = session

        return JSONResponse({
            "session_id": session_id,
            "status": "completed",
            "booking_count": len(current_bookings),
            "account_count": len(account_summaries),
            "anomaly_count": len(anomalies),
            "high_severity_count": sum(1 for a in anomalies if a.severity.value == "hoch"),
            "fiscal_year": fiscal_year,
            "skr": skr,
        })

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/api/session/{session_id}")
async def get_session(session_id: str):
    """Gibt die vollständige Analyse-Session zurück."""
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session nicht gefunden")
    session = sessions[session_id]
    return JSONResponse(session.model_dump())


@app.get("/api/session/{session_id}/anomalies")
async def get_anomalies(session_id: str, severity: Optional[str] = None, resolved: Optional[bool] = None):
    """Gibt Anomalien der Session zurück, optional gefiltert."""
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session nicht gefunden")
    session = sessions[session_id]
    anomalies = session.anomalies

    if severity:
        anomalies = [a for a in anomalies if a.severity.value == severity]
    if resolved is not None:
        anomalies = [a for a in anomalies if a.resolved == resolved]

    return JSONResponse([a.model_dump() for a in anomalies])


@app.get("/api/session/{session_id}/accounts")
async def get_accounts(session_id: str, account_number: Optional[str] = None):
    """Gibt Kontenübersicht zurück."""
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session nicht gefunden")
    session = sessions[session_id]
    accounts = session.accounts

    if account_number:
        accounts = [a for a in accounts if a.account_number == account_number]

    # Bookings weglassen für Übersicht (zu groß)
    result = []
    for a in accounts:
        d = a.model_dump()
        d["bookings"] = []  # nur in Detailansicht
        result.append(d)

    return JSONResponse(result)


@app.get("/api/session/{session_id}/account/{account_number}/bookings")
async def get_account_bookings(session_id: str, account_number: str):
    """Gibt alle Buchungen für ein bestimmtes Konto zurück."""
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session nicht gefunden")
    session = sessions[session_id]

    for acc in session.accounts:
        if acc.account_number == account_number:
            return JSONResponse([b.model_dump() for b in acc.bookings])

    raise HTTPException(status_code=404, detail=f"Konto {account_number} nicht gefunden")


@app.post("/api/session/{session_id}/resolve")
async def resolve_anomaly(session_id: str, request: ResolveRequest):
    """
    Löst eine Auffälligkeit auf.
    Speichert die gewählte Aktion und den Buchungssatz.
    """
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session nicht gefunden")
    session = sessions[session_id]

    anomaly = next((a for a in session.anomalies if a.id == request.anomaly_id), None)
    if not anomaly:
        raise HTTPException(status_code=404, detail="Auffälligkeit nicht gefunden")

    anomaly.resolved = True
    anomaly.resolution_action = request.action
    if request.custom_booking:
        anomaly.resolution_booking = request.custom_booking
    elif anomaly.suggested_booking and request.action != AnomalyAction.IGNORE:
        anomaly.resolution_booking = anomaly.suggested_booking

    return JSONResponse({
        "status": "resolved",
        "anomaly_id": request.anomaly_id,
        "action": request.action.value,
        "booking": anomaly.resolution_booking.model_dump() if anomaly.resolution_booking else None,
    })


@app.get("/api/session/{session_id}/export/datev")
async def export_datev(session_id: str):
    """
    Exportiert alle aufgelösten Buchungssätze als DATEV EXTF-Datei.
    Kann direkt in DATEV importiert werden.
    """
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session nicht gefunden")
    session = sessions[session_id]

    resolved_bookings = []
    for anomaly in session.anomalies:
        if anomaly.resolved and anomaly.resolution_booking and anomaly.resolution_action != AnomalyAction.IGNORE:
            b = anomaly.resolution_booking
            resolved_bookings.append({
                "amount": b.amount,
                "debit_credit": b.debit_credit,
                "account": b.account,
                "counter_account": b.counter_account,
                "bu_key": b.bu_key,
                "document_date": b.document_date,
                "document_ref1": b.document_ref1,
                "text": b.text,
            })

    if not resolved_bookings:
        raise HTTPException(
            status_code=400,
            detail="Keine aufgelösten Buchungssätze vorhanden. "
                   "Bitte erst Auffälligkeiten mit Buchungssatz auflösen."
        )

    datev_content = generate_datev_export(resolved_bookings, session.fiscal_year or "2024")
    filename = f"JA_Korrekturen_{session.fiscal_year}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"

    return Response(
        content=datev_content.encode("windows-1252", errors="replace"),
        media_type="text/csv",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"',
            "Content-Type": "text/csv; charset=windows-1252",
        },
    )


@app.get("/api/session/{session_id}/export/report")
async def export_report(session_id: str):
    """Exportiert einen Prüfbericht als JSON."""
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session nicht gefunden")
    session = sessions[session_id]

    report = {
        "titel": "Jahresabschluss-Prüfbericht",
        "erstellt_am": datetime.now().isoformat(),
        "geschäftsjahr": session.fiscal_year,
        "datei_aktuell": session.filename_current,
        "datei_vorjahr": session.filename_previous,
        "kennzahlen": {
            "gesamtumsatz": session.total_revenue,
            "gesamtaufwand": session.total_expenses,
            "gesamtaktiva": session.total_assets,
            "gesamtpassiva": session.total_liabilities,
        },
        "zusammenfassung": session.summary_text,
        "auffaelligkeiten": [
            {
                "id": a.id,
                "konto": a.account,
                "typ": a.anomaly_type.value,
                "schweregrad": a.severity.value,
                "beschreibung": a.description,
                "empfehlung": a.recommendation,
                "aufgeloest": a.resolved,
                "aktion": a.resolution_action.value if a.resolution_action else None,
                "buchungssatz": a.resolution_booking.model_dump() if a.resolution_booking else None,
            }
            for a in session.anomalies
        ],
    }

    filename = f"Pruefbericht_JA_{session.fiscal_year}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    return Response(
        content=json.dumps(report, ensure_ascii=False, indent=2),
        media_type="application/json",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


# Hilfsfunktionen für Kontotyp-Erkennung
def _is_revenue_account(acc: str, skr: str) -> bool:
    try:
        n = int(acc)
        if skr == "SKR03":
            return 8000 <= n <= 8999
        else:
            return 4000 <= n <= 4999
    except ValueError:
        return False


def _is_expense_account(acc: str, skr: str) -> bool:
    try:
        n = int(acc)
        if skr == "SKR03":
            return 3000 <= n <= 4999 or 7000 <= n <= 7999
        else:
            return 5000 <= n <= 7999
    except ValueError:
        return False


def _is_asset_account(acc: str, skr: str) -> bool:
    try:
        n = int(acc)
        return 0 <= n <= 1999
    except ValueError:
        return False


def _is_liability_account(acc: str, skr: str) -> bool:
    try:
        n = int(acc)
        return 2000 <= n <= 2999
    except ValueError:
        return False


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
