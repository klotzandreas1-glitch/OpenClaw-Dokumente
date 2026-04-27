# SKR03 und SKR04 Kontenrahmen-Wissen für die automatische Buchungsprüfung

SKR03_RANGES = {
    (0, 999): {
        "name": "Anlagevermögen",
        "type": "asset",
        "normal_balance": "S",
        "bilanz_position": "Aktiva",
        "description": "Sachanlagen, immaterielle Vermögensgegenstände, Finanzanlagen",
    },
    (1000, 1999): {
        "name": "Umlaufvermögen",
        "type": "asset",
        "normal_balance": "S",
        "bilanz_position": "Aktiva",
        "description": "Vorräte, Forderungen, Kasse, Bank",
    },
    (2000, 2999): {
        "name": "Eigenkapital, Rückstellungen, Verbindlichkeiten",
        "type": "liability",
        "normal_balance": "H",
        "bilanz_position": "Passiva",
        "description": "Eigenkapital, Rückstellungen, Verbindlichkeiten aus Lieferung/Leistung",
    },
    (3000, 3999): {
        "name": "Wareneinkauf / Materialaufwand",
        "type": "expense",
        "normal_balance": "S",
        "bilanz_position": "GuV",
        "description": "Wareneinsatz, Roh-, Hilfs- und Betriebsstoffe",
    },
    (4000, 4999): {
        "name": "Betriebliche Aufwendungen",
        "type": "expense",
        "normal_balance": "S",
        "bilanz_position": "GuV",
        "description": "Personal, Miete, Abschreibungen, sonstige betriebliche Aufwendungen",
    },
    (7000, 7999): {
        "name": "Sonstige Aufwendungen / Erträge",
        "type": "mixed",
        "normal_balance": "S",
        "bilanz_position": "GuV",
        "description": "Neutrale Aufwendungen und Erträge",
    },
    (8000, 8999): {
        "name": "Erlöskonten",
        "type": "revenue",
        "normal_balance": "H",
        "bilanz_position": "GuV",
        "description": "Umsatzerlöse, sonstige betriebliche Erträge",
    },
    (9000, 9999): {
        "name": "Statistik / Vortragskonten",
        "type": "statistical",
        "normal_balance": "H",
        "bilanz_position": "Bilanz",
        "description": "Saldenvorträge, statistische Konten",
    },
}

SKR04_RANGES = {
    (0, 999): {
        "name": "Anlagevermögen",
        "type": "asset",
        "normal_balance": "S",
        "bilanz_position": "Aktiva",
        "description": "Sachanlagen, immaterielle Vermögensgegenstände, Finanzanlagen",
    },
    (1000, 1999): {
        "name": "Umlaufvermögen",
        "type": "asset",
        "normal_balance": "S",
        "bilanz_position": "Aktiva",
        "description": "Vorräte, Forderungen, Kasse, Bank",
    },
    (2000, 2999): {
        "name": "Eigenkapital, Verbindlichkeiten, Rückstellungen",
        "type": "liability",
        "normal_balance": "H",
        "bilanz_position": "Passiva",
        "description": "Eigenkapital, Verbindlichkeiten, Rückstellungen",
    },
    (4000, 4999): {
        "name": "Betriebseinnahmen (Erlöse)",
        "type": "revenue",
        "normal_balance": "H",
        "bilanz_position": "GuV",
        "description": "Umsatzerlöse, sonstige betriebliche Erträge",
    },
    (5000, 5999): {
        "name": "Material- und Wareneinkauf",
        "type": "expense",
        "normal_balance": "S",
        "bilanz_position": "GuV",
        "description": "Wareneinkauf, Materialaufwand",
    },
    (6000, 6999): {
        "name": "Personalaufwand",
        "type": "expense",
        "normal_balance": "S",
        "bilanz_position": "GuV",
        "description": "Löhne, Gehälter, Sozialabgaben",
    },
    (7000, 7999): {
        "name": "Sonstige Aufwendungen",
        "type": "expense",
        "normal_balance": "S",
        "bilanz_position": "GuV",
        "description": "Abschreibungen, Miete, sonstige betriebliche Aufwendungen",
    },
    (8000, 8999): {
        "name": "Sonstige Erträge / Finanzkonten",
        "type": "mixed",
        "normal_balance": "H",
        "bilanz_position": "GuV",
        "description": "Zinserträge, außerordentliche Erträge",
    },
    (9000, 9999): {
        "name": "Statistik / Vortragskonten",
        "type": "statistical",
        "normal_balance": "H",
        "bilanz_position": "Bilanz",
        "description": "Saldenvorträge, statistische Konten",
    },
}

# Bekannte kritische Konten mit spezifischen Prüfregeln
CRITICAL_ACCOUNTS_SKR03 = {
    "1200": {"name": "Kasse", "check_negative": True, "check_roundamounts": True},
    "1210": {"name": "Postbank", "check_negative": False},
    "1400": {"name": "Forderungen aus L+L", "check_negative": False, "expect_debit": True},
    "1600": {"name": "Verbindlichkeiten aus L+L", "check_negative": False, "expect_credit": True},
    "1776": {"name": "Umsatzsteuer", "check_consistency": True},
    "1780": {"name": "Umsatzsteuer Vorauszahlungen", "check_consistency": True},
    "1790": {"name": "Vorsteuer", "check_consistency": True},
    "2000": {"name": "Eigenkapital", "check_large_movements": True},
    "3400": {"name": "Wareneinkauf 19% VSt", "check_tax": True, "expected_tax_rate": 19},
    "3300": {"name": "Wareneinkauf 7% VSt", "check_tax": True, "expected_tax_rate": 7},
    "4200": {"name": "Gehälter", "check_regularity": True},
    "4110": {"name": "Löhne", "check_regularity": True},
    "8400": {"name": "Erlöse 19% USt", "check_tax": True, "expected_tax_rate": 19},
    "8300": {"name": "Erlöse 7% USt", "check_tax": True, "expected_tax_rate": 7},
}

CRITICAL_ACCOUNTS_SKR04 = {
    "1000": {"name": "Kasse", "check_negative": True, "check_roundamounts": True},
    "1200": {"name": "Bank", "check_negative": False},
    "1400": {"name": "Forderungen aus L+L", "check_negative": False, "expect_debit": True},
    "3300": {"name": "Verbindlichkeiten aus L+L", "check_negative": False, "expect_credit": True},
    "3806": {"name": "Umsatzsteuer", "check_consistency": True},
    "1406": {"name": "Vorsteuer", "check_consistency": True},
    "2000": {"name": "Eigenkapital", "check_large_movements": True},
    "5400": {"name": "Wareneinkauf 19% VSt", "check_tax": True, "expected_tax_rate": 19},
    "5300": {"name": "Wareneinkauf 7% VSt", "check_tax": True, "expected_tax_rate": 7},
    "4400": {"name": "Erlöse 19% USt", "check_tax": True, "expected_tax_rate": 19},
    "4300": {"name": "Erlöse 7% USt", "check_tax": True, "expected_tax_rate": 7},
}

# Typische Buchungslogik - welche Gegenkonten sind für welche Konten plausibel
PLAUSIBLE_COUNTER_ACCOUNTS_SKR03 = {
    "asset_to_asset": "Umschichtung im Umlaufvermögen",
    "asset_to_liability": "Normale Geschäftstätigkeit",
    "liability_to_asset": "Normale Geschäftstätigkeit",
    "revenue_to_asset": "Erlösverbuchung",
    "expense_to_asset": "Aufwandsverbuchung",
    "expense_to_liability": "Aufwand auf Kredit",
}

# BU-Schlüssel (Steuerschlüssel) für USt-Prüfung
BU_KEY_MAPPING = {
    "0": "Keine USt",
    "1": "VSt nicht abzugsfähig",
    "2": "19% USt (Regelsteuersatz)",
    "3": "7% USt (ermäßigter Steuersatz)",
    "4": "Steuerfreie Umsätze",
    "5": "Keine Steuer",
    "6": "19% VSt",
    "7": "7% VSt",
    "8": "VSt nicht abzugsfähig 19%",
    "9": "VSt nicht abzugsfähig 7%",
    "40": "Innergemeinschaftlicher Erwerb",
    "48": "Dreiecksgeschäft",
}


def get_account_info(account_number: str, skr: str = "SKR03") -> dict:
    """Gibt Kontoinformationen basierend auf der Kontonummer zurück."""
    try:
        num = int(account_number)
    except (ValueError, TypeError):
        return {"name": "Unbekannt", "type": "unknown", "normal_balance": "?"}

    ranges = SKR03_RANGES if skr == "SKR03" else SKR04_RANGES

    for (start, end), info in ranges.items():
        if start <= num <= end:
            return info

    return {"name": "Unbekannt", "type": "unknown", "normal_balance": "?"}


def detect_skr(account_numbers: list) -> str:
    """Erkennt automatisch ob SKR03 oder SKR04 verwendet wird."""
    skr03_indicators = 0
    skr04_indicators = 0

    for acc in account_numbers:
        try:
            num = int(str(acc))
            # SKR03: Erlöse auf 8xxx, SKR04: Erlöse auf 4xxx
            if 8000 <= num <= 8999:
                skr03_indicators += 1
            elif 4000 <= num <= 4999:
                # könnte SKR04 Erlöse oder SKR03 Aufwand sein
                pass
            # SKR03: Aufwand auf 4xxx, SKR04: Aufwand auf 5xxx-7xxx
            if 5000 <= num <= 5999:
                skr04_indicators += 1
        except (ValueError, TypeError):
            pass

    return "SKR03" if skr03_indicators >= skr04_indicators else "SKR04"


def is_normal_balance_correct(account_number: str, debit_credit: str, skr: str = "SKR03") -> bool:
    """Prüft ob Soll/Haben-Buchung für das Konto plausibel ist."""
    info = get_account_info(account_number, skr)
    normal = info.get("normal_balance", "?")
    if normal == "?":
        return True  # Unbekanntes Konto - kein Fehler annehmen
    return debit_credit == normal


def get_account_description_for_prompt(accounts_data: dict, skr: str = "SKR03") -> str:
    """Erstellt eine kompakte Kontenbeschreibung für den KI-Prompt."""
    lines = []
    for acc_num, data in sorted(accounts_data.items()):
        info = get_account_info(acc_num, skr)
        balance = data.get("balance", 0)
        count = data.get("count", 0)
        lines.append(
            f"Konto {acc_num} ({info.get('name', 'Unbekannt')}): "
            f"Saldo {balance:,.2f} EUR, {count} Buchungen, Typ: {info.get('type', '?')}"
        )
    return "\n".join(lines)
