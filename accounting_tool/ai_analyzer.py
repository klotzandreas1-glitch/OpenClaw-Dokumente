"""
KI-gestützte Buchungsanalyse mit Claude API.
Verwendet Prompt Caching für effiziente Analyse großer Buchungsmengen.
"""

import json
import uuid
import os
from collections import defaultdict
from typing import Optional

import anthropic

from models import (
    Anomaly, AnomalyType, AnomalySeverity, AnomalyAction,
    Booking, BookingSuggestion, AccountSummary,
)
from skr_knowledge import (
    get_account_info, detect_skr, get_account_description_for_prompt,
    is_normal_balance_correct, BU_KEY_MAPPING,
)

MODEL = "claude-sonnet-4-6"

SYSTEM_PROMPT = """Du bist ein erfahrener Steuerberater und Wirtschaftsprüfer in Deutschland, spezialisiert auf
die Erstellung von Jahresabschlüssen nach HGB. Du analysierst DATEV-Buchungsdaten und erkennst:

1. Falschbuchungen (falsches Konto, falscher Buchungsschlüssel)
2. Doppelbuchungen
3. Offene Posten die ausgebucht werden müssen
4. Auffällige Abweichungen zum Vorjahr
5. Ungewöhnliche Beträge oder Buchungsmuster
6. Logische Fehler in Buchungssätzen
7. Steuerliche Auffälligkeiten (falsche BU-Schlüssel, USt-Probleme)
8. Bilanzierungsfehler (falsche Aktivierung/Passivierung)

Für jede Auffälligkeit gibst du:
- Eine klare Beschreibung des Problems
- Eine konkrete Empfehlung zur Behandlung
- Den vorgeschlagenen Buchungssatz zur Korrektur (wenn zutreffend)

Du antwortest IMMER auf Deutsch und ausschließlich im folgenden JSON-Format:

{
  "summary": "Zusammenfassung der Analyse in 3-5 Sätzen",
  "jahresabschluss_hinweise": ["Hinweis 1", "Hinweis 2"],
  "anomalies": [
    {
      "account": "Kontonummer",
      "anomaly_type": "Falschbuchung|Doppelbuchung|Offener Posten|Vorjahresabweichung|Fehlender Beleg|Ungewöhnlicher Betrag|Logischer Fehler|Steuerproblem|Saldenabweichung",
      "severity": "hoch|mittel|niedrig",
      "description": "Genaue Beschreibung des Problems",
      "recommendation": "Konkrete Empfehlung",
      "booking_ids": [],
      "suggested_action": "ausbuchen|umbuchen|ignorieren|mandantenrueckfrage|korrektur|offene_posten_ausbuchen|abgrenzung",
      "possible_actions": ["ausbuchen", "umbuchen"],
      "suggested_booking": {
        "amount": 0.00,
        "debit_credit": "S",
        "account": "1200",
        "counter_account": "4900",
        "bu_key": "",
        "document_date": "3112",
        "document_ref1": "KORR-001",
        "text": "Korrektur Jahresabschluss"
      }
    }
  ]
}

Wichtig: suggested_booking ist optional und nur angeben wenn ein konkreter Buchungssatz zur Korrektur sinnvoll ist.
Das Feld "possible_actions" enthält alle sinnvollen Aktionen für diese Auffälligkeit.
"""


def compute_account_aggregates(bookings: list[Booking]) -> dict:
    """Berechnet Salden und Statistiken pro Konto."""
    accounts: dict = defaultdict(lambda: {
        "bookings": [], "debit_sum": 0.0, "credit_sum": 0.0,
        "count": 0, "amounts": [],
    })

    for b in bookings:
        acc = accounts[b.account]
        acc["bookings"].append(b)
        acc["count"] += 1
        acc["amounts"].append(b.amount)
        if b.debit_credit == "S":
            acc["debit_sum"] += b.amount
        else:
            acc["credit_sum"] += b.amount

    for acc_num, data in accounts.items():
        data["balance"] = data["debit_sum"] - data["credit_sum"]

    return dict(accounts)


def detect_rule_based_anomalies(
    bookings: list[Booking],
    accounts_data: dict,
    previous_accounts: Optional[dict],
    skr: str,
) -> list[Anomaly]:
    """Regelbasierte Vorprüfung vor der KI-Analyse."""
    anomalies = []

    # 1. Negative Kassensalden
    for acc_num, data in accounts_data.items():
        try:
            num = int(acc_num)
        except ValueError:
            continue

        # Kasse (SKR03: 1200, SKR04: 1000) darf nicht negativ sein
        if (skr == "SKR03" and acc_num == "1200") or (skr == "SKR04" and acc_num == "1000"):
            if data["balance"] < 0:
                anomalies.append(Anomaly(
                    id=str(uuid.uuid4()),
                    account=acc_num,
                    anomaly_type=AnomalyType.LOGICAL_ERROR,
                    severity=AnomalySeverity.HIGH,
                    description=f"Kassenkonto {acc_num} weist einen negativen Saldo von "
                                f"{data['balance']:,.2f} EUR auf. Eine Kasse kann nicht negativ sein.",
                    recommendation="Bitte prüfen Sie alle Kassenbuchungen auf Vollständigkeit. "
                                   "Möglicherweise fehlen Einzahlungen oder es liegen Doppelzahlungen vor.",
                    possible_actions=[AnomalyAction.CORRECTION, AnomalyAction.CLIENT_QUERY],
                    suggested_action=AnomalyAction.CLIENT_QUERY,
                ))

    # 2. Buchungen ohne Beleg
    no_doc_bookings = [b for b in bookings if not b.document_ref1 and not b.document_ref2]
    if len(no_doc_bookings) > 5:
        anomalies.append(Anomaly(
            id=str(uuid.uuid4()),
            booking_ids=[b.id for b in no_doc_bookings[:10]],
            account="Diverse",
            anomaly_type=AnomalyType.MISSING_DOCUMENT,
            severity=AnomalySeverity.MEDIUM,
            description=f"{len(no_doc_bookings)} Buchungen haben keine Belegnummer (Belegfeld 1 und 2 leer).",
            recommendation="Belegnummern sind für steuerliche Zwecke wichtig. "
                           "Bitte beim Mandanten die fehlenden Belege anfordern.",
            possible_actions=[AnomalyAction.CLIENT_QUERY, AnomalyAction.IGNORE],
            suggested_action=AnomalyAction.CLIENT_QUERY,
        ))

    # 3. Doppelbuchungen erkennen (gleicher Betrag, Datum, Konto, Gegenkonto)
    seen = {}
    for b in bookings:
        key = (b.amount, b.account, b.counter_account, b.document_date)
        if key in seen:
            existing = seen[key]
            anomalies.append(Anomaly(
                id=str(uuid.uuid4()),
                booking_ids=[existing.id, b.id],
                account=b.account,
                anomaly_type=AnomalyType.DUPLICATE,
                severity=AnomalySeverity.HIGH,
                description=f"Mögliche Doppelbuchung erkannt: Betrag {b.amount:,.2f} EUR "
                             f"auf Konto {b.account} / Gegenkonto {b.counter_account} "
                             f"am {b.document_date} erscheint zweimal.",
                recommendation="Bitte prüfen ob es sich um zwei separate Geschäftsvorfälle handelt "
                               "oder eine Doppelbuchung vorliegt.",
                possible_actions=[AnomalyAction.WRITE_OFF, AnomalyAction.IGNORE, AnomalyAction.CLIENT_QUERY],
                suggested_action=AnomalyAction.CLIENT_QUERY,
            ))
        else:
            seen[key] = b

    # 4. Falsche Soll/Haben-Seite
    for b in bookings:
        if not is_normal_balance_correct(b.account, b.debit_credit, skr):
            info = get_account_info(b.account, skr)
            if info.get("type") not in ("unknown", "mixed", "statistical"):
                anomalies.append(Anomaly(
                    id=str(uuid.uuid4()),
                    booking_ids=[b.id],
                    account=b.account,
                    anomaly_type=AnomalyType.WRONG_ACCOUNT,
                    severity=AnomalySeverity.MEDIUM,
                    description=f"Konto {b.account} ({info.get('name', '')}) wurde auf der "
                                f"{'Soll' if b.debit_credit == 'S' else 'Haben'}-Seite gebucht, "
                                f"obwohl der Normalsaldo {'Soll' if info['normal_balance'] == 'S' else 'Haben'} ist. "
                                f"Betrag: {b.amount:,.2f} EUR, Buchungstext: {b.text or 'k.A.'}",
                    recommendation=f"Bitte prüfen ob die Buchung auf dem richtigen Konto steht "
                                   f"und ob die Soll/Haben-Seite korrekt ist.",
                    possible_actions=[AnomalyAction.CORRECTION, AnomalyAction.REBOOK, AnomalyAction.IGNORE],
                    suggested_action=AnomalyAction.CORRECTION,
                ))

    # 5. Vorjahresabweichungen
    if previous_accounts:
        for acc_num, curr_data in accounts_data.items():
            if acc_num in previous_accounts:
                prev_balance = previous_accounts[acc_num].get("balance", 0)
                curr_balance = curr_data["balance"]
                if prev_balance != 0:
                    deviation_pct = abs((curr_balance - prev_balance) / prev_balance) * 100
                    if deviation_pct > 50 and abs(curr_balance - prev_balance) > 5000:
                        info = get_account_info(acc_num, skr)
                        anomalies.append(Anomaly(
                            id=str(uuid.uuid4()),
                            account=acc_num,
                            anomaly_type=AnomalyType.YOY_DEVIATION,
                            severity=AnomalySeverity.MEDIUM if deviation_pct < 100 else AnomalySeverity.HIGH,
                            description=f"Konto {acc_num} ({info.get('name', '')}) weicht um "
                                        f"{deviation_pct:.1f}% vom Vorjahr ab. "
                                        f"Vorjahr: {prev_balance:,.2f} EUR, "
                                        f"Aktuell: {curr_balance:,.2f} EUR.",
                            recommendation="Bitte die Abweichung erklären. Handelt es sich um eine "
                                           "beabsichtigte Änderung oder liegt ein Buchungsfehler vor?",
                            possible_actions=[AnomalyAction.CLIENT_QUERY, AnomalyAction.IGNORE, AnomalyAction.CORRECTION],
                            suggested_action=AnomalyAction.CLIENT_QUERY,
                        ))

    return anomalies


def build_analysis_prompt(
    bookings: list[Booking],
    accounts_data: dict,
    previous_accounts: Optional[dict],
    skr: str,
    fiscal_year: str,
) -> str:
    """Erstellt den KI-Analyse-Prompt mit allen Buchungsdaten."""
    account_overview = get_account_description_for_prompt(accounts_data, skr)

    # Buchungen pro Konto gruppiert (max 50 pro Konto für Prompt-Effizienz)
    account_bookings_text = []
    by_account: dict = defaultdict(list)
    for b in bookings:
        by_account[b.account].append(b)

    for acc_num in sorted(by_account.keys()):
        accs = by_account[acc_num]
        info = get_account_info(acc_num, skr)
        lines = [f"\n=== Konto {acc_num} ({info.get('name', 'Unbekannt')}) - {len(accs)} Buchungen ==="]
        for b in accs[:50]:
            lines.append(
                f"  [{b.document_date}] {b.debit_credit} {b.amount:>12,.2f} EUR | "
                f"GK: {b.counter_account} | BU: {b.bu_key or '-'} | "
                f"Beleg: {b.document_ref1 or '-'} | {b.text or '-'}"
            )
        if len(accs) > 50:
            lines.append(f"  ... und {len(accs) - 50} weitere Buchungen")
        account_bookings_text.append("\n".join(lines))

    prev_text = ""
    if previous_accounts:
        prev_text = "\n\n## VORJAHRESVERGLEICH:\n"
        for acc_num, prev_data in sorted(previous_accounts.items()):
            curr_balance = accounts_data.get(acc_num, {}).get("balance", 0)
            prev_balance = prev_data.get("balance", 0)
            if prev_balance != 0:
                dev = (curr_balance - prev_balance) / abs(prev_balance) * 100
                prev_text += f"  Konto {acc_num}: Vorjahr {prev_balance:,.2f} EUR → Aktuell {curr_balance:,.2f} EUR ({dev:+.1f}%)\n"

    prompt = f"""# DATEV-Buchungsanalyse für Jahresabschluss {fiscal_year}
## Kontenrahmen: {skr}
## Gesamtanzahl Buchungen: {len(bookings)}

## KONTENÜBERSICHT (Salden):
{account_overview}
{prev_text}

## DETAILLIERTE BUCHUNGEN PER KONTO:
{"".join(account_bookings_text)}

---

Bitte analysiere alle Buchungen auf:
1. Logische Fehler und Falschbuchungen
2. Ungewöhnliche Beträge oder Muster
3. Doppelbuchungen
4. Offene Posten die zum Jahresabschluss ausgebucht werden sollten
5. Steuerliche Auffälligkeiten (USt, VSt, BU-Schlüssel)
6. Notwendige Abgrenzungsbuchungen zum Jahresabschluss
7. Bilanzierungsprobleme
8. Hinweise für die Erstellung des Jahresabschlusses

Gib deine Antwort AUSSCHLIESSLICH im vorgegebenen JSON-Format aus.
"""
    return prompt


async def analyze_bookings(
    bookings: list[Booking],
    previous_bookings: Optional[list[Booking]],
    fiscal_year: str = "2024",
) -> tuple[list[Anomaly], str, list[str]]:
    """
    Hauptanalysefunktion: Kombiniert regelbasierte und KI-Analyse.
    Gibt (Anomalien, Zusammenfassung, JA-Hinweise) zurück.
    """
    client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))

    # Konten-Aggregate berechnen
    accounts_data = compute_account_aggregates(bookings)
    previous_accounts = compute_account_aggregates(previous_bookings) if previous_bookings else None

    # SKR erkennen
    account_numbers = list(accounts_data.keys())
    skr = detect_skr(account_numbers)

    # Regelbasierte Anomalien
    rule_anomalies = detect_rule_based_anomalies(bookings, accounts_data, previous_accounts, skr)

    # KI-Analyse mit Claude (Prompt Caching für große Datensätze)
    analysis_prompt = build_analysis_prompt(
        bookings, accounts_data, previous_accounts, skr, fiscal_year
    )

    try:
        response = client.messages.create(
            model=MODEL,
            max_tokens=8192,
            system=[
                {
                    "type": "text",
                    "text": SYSTEM_PROMPT,
                    "cache_control": {"type": "ephemeral"},
                }
            ],
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": analysis_prompt,
                            "cache_control": {"type": "ephemeral"},
                        }
                    ],
                }
            ],
        )

        raw_text = response.content[0].text.strip()

        # JSON aus Response extrahieren
        if "```json" in raw_text:
            raw_text = raw_text.split("```json")[1].split("```")[0].strip()
        elif "```" in raw_text:
            raw_text = raw_text.split("```")[1].split("```")[0].strip()

        ai_result = json.loads(raw_text)

        summary = ai_result.get("summary", "Analyse abgeschlossen.")
        ja_hints = ai_result.get("jahresabschluss_hinweise", [])
        ai_anomalies_raw = ai_result.get("anomalies", [])

        # KI-Anomalien in Anomaly-Objekte konvertieren
        ai_anomalies = []
        type_map = {v.value: v for v in AnomalyType}
        severity_map = {v.value: v for v in AnomalySeverity}
        action_map = {v.value: v for v in AnomalyAction}

        for a in ai_anomalies_raw:
            try:
                atype = type_map.get(a.get("anomaly_type", ""), AnomalyType.LOGICAL_ERROR)
                asev = severity_map.get(a.get("severity", "mittel"), AnomalySeverity.MEDIUM)
                aaction = action_map.get(a.get("suggested_action", "ignorieren"), AnomalyAction.IGNORE)

                possible = [
                    action_map.get(p, AnomalyAction.IGNORE)
                    for p in a.get("possible_actions", [a.get("suggested_action", "ignorieren")])
                ]

                suggested_booking = None
                if a.get("suggested_booking"):
                    sb = a["suggested_booking"]
                    suggested_booking = BookingSuggestion(
                        amount=float(sb.get("amount", 0)),
                        debit_credit=sb.get("debit_credit", "S"),
                        account=str(sb.get("account", "")),
                        counter_account=str(sb.get("counter_account", "")),
                        bu_key=sb.get("bu_key") or None,
                        document_date=str(sb.get("document_date", "3112")),
                        document_ref1=sb.get("document_ref1") or None,
                        text=str(sb.get("text", "")),
                        description=str(sb.get("text", "")),
                    )

                anomaly = Anomaly(
                    id=str(uuid.uuid4()),
                    booking_ids=a.get("booking_ids", []),
                    account=str(a.get("account", "")),
                    anomaly_type=atype,
                    severity=asev,
                    description=a.get("description", ""),
                    recommendation=a.get("recommendation", ""),
                    possible_actions=possible if possible else [AnomalyAction.IGNORE],
                    suggested_action=aaction,
                    suggested_booking=suggested_booking,
                    ai_explanation=a.get("description", ""),
                )
                ai_anomalies.append(anomaly)
            except Exception:
                continue

        all_anomalies = rule_anomalies + ai_anomalies
        return all_anomalies, summary, ja_hints

    except anthropic.APIError as e:
        error_summary = f"KI-Analyse konnte nicht durchgeführt werden: {e}. Nur regelbasierte Prüfung verfügbar."
        return rule_anomalies, error_summary, []
    except json.JSONDecodeError:
        error_summary = "KI-Antwort konnte nicht verarbeitet werden. Nur regelbasierte Prüfung verfügbar."
        return rule_anomalies, error_summary, []


def build_account_summaries(
    bookings: list[Booking],
    anomalies: list[Anomaly],
    skr: str,
) -> list[AccountSummary]:
    """Erstellt AccountSummary-Objekte für alle Konten."""
    accounts_data = compute_account_aggregates(bookings)
    anomaly_count_per_account: dict = defaultdict(int)
    for a in anomalies:
        anomaly_count_per_account[a.account] += 1

    summaries = []
    for acc_num, data in sorted(accounts_data.items()):
        info = get_account_info(acc_num, skr)
        summaries.append(AccountSummary(
            account_number=acc_num,
            account_name=info.get("name", "Unbekannt"),
            account_type=info.get("type", "unknown"),
            balance_current=data["balance"],
            booking_count=data["count"],
            anomaly_count=anomaly_count_per_account.get(acc_num, 0),
            bookings=data["bookings"],
        ))

    return summaries
