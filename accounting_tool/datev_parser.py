"""
DATEV EXTF-Format Parser
Unterstützt:
- DATEV Buchungsexport (EXTF Format, Kategorie 21)
- Einfache CSV-Exporte mit Standard-Spaltenbezeichnungen
- Excel-Exporte (.xlsx)
"""

import io
import re
import uuid
import chardet
import pandas as pd
from typing import Optional, Tuple
from models import Booking


DATEV_EXTF_COLUMNS = [
    "Umsatz", "Soll/Haben-Kennzeichen", "WKZ Umsatz", "Kurs",
    "Basis-Umsatz", "WKZ Basis-Umsatz", "Konto", "Gegenkonto (ohne BU-Schlüssel)",
    "BU-Schlüssel", "Belegdatum", "Belegfeld 1", "Belegfeld 2",
    "Skonto", "Buchungstext", "Postensperre", "Diverse Adressnummer",
    "Geschäftspartnerbank", "Sachverhalt", "Zinssperre", "Beleglink",
    "Beleginfo - Art 1", "Beleginfo - Inhalt 1", "Beleginfo - Art 2",
    "Beleginfo - Inhalt 2", "Beleginfo - Art 3", "Beleginfo - Inhalt 3",
    "Beleginfo - Art 4", "Beleginfo - Inhalt 4", "Beleginfo - Art 5",
    "Beleginfo - Inhalt 5", "Beleginfo - Art 6", "Beleginfo - Inhalt 6",
    "Beleginfo - Art 7", "Beleginfo - Inhalt 7", "Beleginfo - Art 8",
    "Beleginfo - Inhalt 8", "KOST1 - Kostenstelle", "KOST2 - Kostenstelle",
    "KOST-Menge", "EU-Land u. UStID", "EU-Steuersatz",
    "Abw. Versteuerungsart", "Sachverhalt L+L", "Funktionsergänzung L+L",
    "BU 49 Hauptfunktionstyp", "BU 49 Hauptfunktionsnummer",
    "BU 49 Funktionsergänzung", "Zusatzinformation - Art 1",
    "Zusatzinformation - Inhalt 1",
]

COLUMN_ALIASES = {
    "betrag": "Umsatz",
    "amount": "Umsatz",
    "umsatz": "Umsatz",
    "soll/haben": "Soll/Haben-Kennzeichen",
    "soll_haben": "Soll/Haben-Kennzeichen",
    "sh": "Soll/Haben-Kennzeichen",
    "konto": "Konto",
    "account": "Konto",
    "gegenkonto": "Gegenkonto (ohne BU-Schlüssel)",
    "counter_account": "Gegenkonto (ohne BU-Schlüssel)",
    "bu": "BU-Schlüssel",
    "bu-schlüssel": "BU-Schlüssel",
    "belegdatum": "Belegdatum",
    "datum": "Belegdatum",
    "date": "Belegdatum",
    "belegfeld1": "Belegfeld 1",
    "belegfeld 1": "Belegfeld 1",
    "belegfeld2": "Belegfeld 2",
    "belegfeld 2": "Belegfeld 2",
    "buchungstext": "Buchungstext",
    "text": "Buchungstext",
    "description": "Buchungstext",
    "kostenstelle": "KOST1 - Kostenstelle",
    "kost1": "KOST1 - Kostenstelle",
    "kost2": "KOST2 - Kostenstelle",
}


class ParseError(Exception):
    pass


def detect_encoding(raw_bytes: bytes) -> str:
    result = chardet.detect(raw_bytes[:10000])
    encoding = result.get("encoding", "utf-8") or "utf-8"
    # DATEV often uses Windows-1252
    if encoding.lower() in ("ascii", "windows-1252", "iso-8859-1"):
        return "windows-1252"
    return encoding


def is_datev_extf(content: str) -> bool:
    first_line = content.split("\n")[0].strip()
    return first_line.startswith('"EXTF"') or first_line.startswith("EXTF")


def parse_datev_header(content: str) -> dict:
    """Parst den DATEV EXTF Header (erste Zeile) und gibt Metadaten zurück."""
    lines = content.split("\n")
    if len(lines) < 2:
        return {}

    header_line = lines[0].strip()
    # CSV-Parse der Headerzeile
    try:
        import csv
        reader = csv.reader(io.StringIO(header_line), delimiter=";")
        fields = next(reader)
    except Exception:
        fields = header_line.split(";")

    meta = {}
    if len(fields) > 0:
        meta["format"] = fields[0].strip('"')
    if len(fields) > 2:
        meta["data_category"] = fields[2].strip('"')
    if len(fields) > 3:
        meta["format_name"] = fields[3].strip('"')
    if len(fields) > 11:
        meta["consultant_number"] = fields[11].strip('"')
    if len(fields) > 12:
        meta["client_number"] = fields[12].strip('"')
    if len(fields) > 13:
        raw_year = fields[13].strip('"')
        if raw_year and len(raw_year) >= 4:
            meta["fiscal_year"] = raw_year[:4]
    if len(fields) > 15:
        meta["period_start"] = fields[15].strip('"')
    if len(fields) > 16:
        meta["period_end"] = fields[16].strip('"')

    return meta


def normalize_amount(value) -> float:
    """Wandelt DATEV-Betragsformat (Komma als Dezimaltrennzeichen) in float um."""
    if value is None or str(value).strip() == "":
        return 0.0
    s = str(value).strip().replace(" ", "")
    # DATEV: Punkt als Tausender, Komma als Dezimal
    if "," in s and "." in s:
        s = s.replace(".", "").replace(",", ".")
    elif "," in s:
        s = s.replace(",", ".")
    try:
        return float(s)
    except ValueError:
        return 0.0


def normalize_date(value) -> str:
    """Normalisiert DATEV-Datumsformate."""
    if value is None:
        return ""
    s = str(value).strip()
    if not s or s == "nan":
        return ""
    # DDMM (DATEV Kurzform ohne Jahr)
    if re.match(r"^\d{4}$", s):
        return f"{s[0:2]}.{s[2:4]}."
    # DDMMYYYY
    if re.match(r"^\d{8}$", s):
        return f"{s[0:2]}.{s[2:4]}.{s[4:8]}"
    # Bereits formatiert
    return s


def normalize_columns(df: pd.DataFrame) -> pd.DataFrame:
    """Normalisiert Spaltennamen auf einheitliche interne Namen."""
    rename_map = {}
    for col in df.columns:
        normalized = col.lower().strip().replace(" ", "_").replace("-", "_")
        if normalized in COLUMN_ALIASES:
            rename_map[col] = COLUMN_ALIASES[normalized]
        elif col.lower() in COLUMN_ALIASES:
            rename_map[col] = COLUMN_ALIASES[col.lower()]
    if rename_map:
        df = df.rename(columns=rename_map)
    return df


def parse_extf_content(content: str) -> Tuple[dict, pd.DataFrame]:
    """Parst DATEV EXTF Format: Header + Buchungsdaten."""
    meta = parse_datev_header(content)
    lines = content.split("\n")

    # Zeile 1: EXTF Header, Zeile 2: Spaltenköpfe, ab Zeile 3: Daten
    data_lines = "\n".join(lines[2:])

    try:
        df = pd.read_csv(
            io.StringIO(data_lines),
            sep=";",
            header=0,
            dtype=str,
            keep_default_na=False,
            on_bad_lines="skip",
        )
    except Exception as e:
        raise ParseError(f"Fehler beim Parsen der DATEV-Daten: {e}")

    # Spalten umbenennen wenn nötig (manchmal fehlt Zeile 2)
    if len(df.columns) >= 8 and str(df.columns[0]).strip().lower() not in ("umsatz", "betrag"):
        # Spaltenköpfe sind bereits data -> header fehlt, nutze Standard-Mapping
        col_count = len(df.columns)
        assigned = DATEV_EXTF_COLUMNS[:col_count]
        df.columns = assigned

    return meta, df


def parse_csv_content(content: str) -> Tuple[dict, pd.DataFrame]:
    """Parst einfache CSV-Exporte (kein EXTF Header)."""
    separators = [";", ",", "\t"]
    df = None
    for sep in separators:
        try:
            df = pd.read_csv(
                io.StringIO(content),
                sep=sep,
                dtype=str,
                keep_default_na=False,
                on_bad_lines="skip",
            )
            if len(df.columns) >= 4:
                break
        except Exception:
            continue

    if df is None or df.empty:
        raise ParseError("Konnte CSV nicht parsen. Bitte Dateiformat prüfen.")

    return {}, normalize_columns(df)


def df_to_bookings(df: pd.DataFrame, skr: str = "SKR03") -> list[Booking]:
    """Konvertiert einen DataFrame in eine Liste von Booking-Objekten."""
    bookings = []

    col_map = {
        "amount": next(
            (c for c in df.columns if c in ("Umsatz", "Betrag", "Amount")), None
        ),
        "sh": next(
            (c for c in df.columns if "Soll/Haben" in c or c in ("SH", "Soll_Haben")), None
        ),
        "account": next(
            (c for c in df.columns if c == "Konto"), None
        ),
        "counter": next(
            (c for c in df.columns if "Gegenkonto" in c), None
        ),
        "bu": next(
            (c for c in df.columns if "BU" in c and "Schlüssel" in c or c == "BU"), None
        ),
        "date": next(
            (c for c in df.columns if "Belegdatum" in c or c in ("Datum", "Date")), None
        ),
        "ref1": next(
            (c for c in df.columns if "Belegfeld 1" in c or c == "Belegfeld1"), None
        ),
        "ref2": next(
            (c for c in df.columns if "Belegfeld 2" in c or c == "Belegfeld2"), None
        ),
        "text": next(
            (c for c in df.columns if "Buchungstext" in c or c in ("Text", "Beschreibung")), None
        ),
        "kost1": next(
            (c for c in df.columns if "KOST1" in c), None
        ),
        "kost2": next(
            (c for c in df.columns if "KOST2" in c), None
        ),
        "currency": next(
            (c for c in df.columns if "WKZ" in c and "Umsatz" in c), None
        ),
    }

    for idx, row in df.iterrows():
        amount_raw = row.get(col_map["amount"], "") if col_map["amount"] else ""
        amount = normalize_amount(amount_raw)
        if amount == 0.0 and not str(amount_raw).strip():
            continue

        sh = str(row.get(col_map["sh"], "S")).strip().upper() if col_map["sh"] else "S"
        if sh not in ("S", "H"):
            sh = "S"

        account = str(row.get(col_map["account"], "")).strip() if col_map["account"] else ""
        counter = str(row.get(col_map["counter"], "")).strip() if col_map["counter"] else ""

        if not account or account == "nan":
            continue

        booking = Booking(
            id=str(uuid.uuid4()),
            amount=amount,
            debit_credit=sh,
            currency=str(row.get(col_map["currency"], "EUR")).strip() if col_map["currency"] else "EUR",
            account=account,
            counter_account=counter if counter != "nan" else "",
            bu_key=str(row.get(col_map["bu"], "")).strip() if col_map["bu"] else None,
            document_date=normalize_date(row.get(col_map["date"], "")) if col_map["date"] else "",
            document_ref1=str(row.get(col_map["ref1"], "")).strip() if col_map["ref1"] else None,
            document_ref2=str(row.get(col_map["ref2"], "")).strip() if col_map["ref2"] else None,
            text=str(row.get(col_map["text"], "")).strip() if col_map["text"] else None,
            cost_center1=str(row.get(col_map["kost1"], "")).strip() if col_map["kost1"] else None,
            cost_center2=str(row.get(col_map["kost2"], "")).strip() if col_map["kost2"] else None,
            row_number=int(idx) + 1,
        )
        bookings.append(booking)

    return bookings


def parse_file(file_content: bytes, filename: str) -> Tuple[dict, list[Booking]]:
    """
    Hauptfunktion: Parst eine DATEV-Datei (CSV, EXTF oder Excel).
    Gibt (Metadaten, Buchungsliste) zurück.
    """
    if filename.lower().endswith((".xlsx", ".xls")):
        try:
            df = pd.read_excel(io.BytesIO(file_content), dtype=str, keep_default_na=False)
            df = normalize_columns(df)
            bookings = df_to_bookings(df)
            return {}, bookings
        except Exception as e:
            raise ParseError(f"Excel-Datei konnte nicht gelesen werden: {e}")

    # Text-Datei: Encoding erkennen
    encoding = detect_encoding(file_content)
    try:
        content = file_content.decode(encoding, errors="replace")
    except Exception:
        content = file_content.decode("utf-8", errors="replace")

    if is_datev_extf(content):
        meta, df = parse_extf_content(content)
    else:
        meta, df = parse_csv_content(content)

    bookings = df_to_bookings(df)

    if not bookings:
        raise ParseError(
            "Keine Buchungen gefunden. Bitte prüfen Sie, ob die Datei Buchungsdaten enthält "
            "und die Spalten 'Konto', 'Umsatz' und 'Soll/Haben' vorhanden sind."
        )

    return meta, bookings


def generate_datev_export(bookings_data: list[dict], fiscal_year: str = "2024") -> str:
    """
    Generiert einen DATEV EXTF-kompatiblen Export aus Buchungssätzen.
    Kann direkt in DATEV importiert werden.
    """
    from datetime import datetime

    timestamp = datetime.now().strftime("%Y%m%d%H%M%S000")
    year_start = f"{fiscal_year}0101"
    year_end = f"{fiscal_year}1231"

    header = (
        f'"EXTF";700;21;"Buchungsstapel";7;{timestamp};;"KI-Korrektur";"";"";"";'
        f'"";""  ;{year_start};4;{year_start};{year_end};"Jahresabschluss-Korrekturen";0;""\r\n'
    )

    col_header = (
        "Umsatz;Soll/Haben-Kennzeichen;WKZ Umsatz;Kurs;Basis-Umsatz;WKZ Basis-Umsatz;"
        "Konto;Gegenkonto (ohne BU-Schlüssel);BU-Schlüssel;Belegdatum;Belegfeld 1;"
        "Belegfeld 2;Skonto;Buchungstext\r\n"
    )

    rows = []
    for b in bookings_data:
        amount_str = f"{b.get('amount', 0):.2f}".replace(".", ",")
        sh = b.get("debit_credit", "S")
        account = b.get("account", "")
        counter = b.get("counter_account", "")
        bu = b.get("bu_key", "") or ""
        date = b.get("document_date", "").replace(".", "")
        ref1 = b.get("document_ref1", "") or ""
        text = b.get("text", "") or ""

        row = f"{amount_str};{sh};EUR;;;;"
        row += f"{account};{counter};{bu};{date};{ref1};;;{text}"
        rows.append(row)

    return header + col_header + "\r\n".join(rows)
