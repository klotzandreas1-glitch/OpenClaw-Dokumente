from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from enum import Enum


class AnomalyType(str, Enum):
    WRONG_ACCOUNT = "Falschbuchung"
    DUPLICATE = "Doppelbuchung"
    OPEN_ITEM = "Offener Posten"
    YOY_DEVIATION = "Vorjahresabweichung"
    MISSING_DOCUMENT = "Fehlender Beleg"
    UNUSUAL_AMOUNT = "Ungewöhnlicher Betrag"
    LOGICAL_ERROR = "Logischer Fehler"
    TAX_ISSUE = "Steuerproblem"
    BALANCE_MISMATCH = "Saldenabweichung"


class AnomalySeverity(str, Enum):
    HIGH = "hoch"
    MEDIUM = "mittel"
    LOW = "niedrig"


class AnomalyAction(str, Enum):
    WRITE_OFF = "ausbuchen"
    REBOOK = "umbuchen"
    IGNORE = "ignorieren"
    CLIENT_QUERY = "mandantenrueckfrage"
    CORRECTION = "korrektur"
    OPEN_ITEM_CLEAR = "offene_posten_ausbuchen"
    ACCRUAL = "abgrenzung"


class Booking(BaseModel):
    id: str
    amount: float
    debit_credit: str  # S=Soll, H=Haben
    currency: str = "EUR"
    account: str
    counter_account: str
    bu_key: Optional[str] = None
    document_date: str
    document_ref1: Optional[str] = None
    document_ref2: Optional[str] = None
    text: Optional[str] = None
    cost_center1: Optional[str] = None
    cost_center2: Optional[str] = None
    tax_key: Optional[str] = None
    row_number: int = 0


class BookingSuggestion(BaseModel):
    amount: float
    debit_credit: str
    account: str
    counter_account: str
    bu_key: Optional[str] = None
    document_date: str
    document_ref1: Optional[str] = None
    text: str
    description: str


class Anomaly(BaseModel):
    id: str
    booking_ids: List[str] = []
    account: str
    anomaly_type: AnomalyType
    severity: AnomalySeverity
    description: str
    recommendation: str
    possible_actions: List[AnomalyAction]
    suggested_action: AnomalyAction
    suggested_booking: Optional[BookingSuggestion] = None
    resolved: bool = False
    resolution_action: Optional[AnomalyAction] = None
    resolution_booking: Optional[BookingSuggestion] = None
    ai_explanation: Optional[str] = None


class AccountSummary(BaseModel):
    account_number: str
    account_name: str
    account_type: str
    balance_current: float
    balance_previous: Optional[float] = None
    yoy_change_pct: Optional[float] = None
    booking_count: int
    anomaly_count: int
    bookings: List[Booking] = []


class AnalysisSession(BaseModel):
    session_id: str
    filename_current: str
    filename_previous: Optional[str] = None
    fiscal_year: Optional[str] = None
    accounts: List[AccountSummary] = []
    anomalies: List[Anomaly] = []
    analysis_status: str = "pending"
    total_revenue: float = 0.0
    total_expenses: float = 0.0
    total_assets: float = 0.0
    total_liabilities: float = 0.0
    summary_text: Optional[str] = None


class ResolveRequest(BaseModel):
    anomaly_id: str
    action: AnomalyAction
    custom_booking: Optional[BookingSuggestion] = None
    note: Optional[str] = None
