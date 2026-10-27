from pydantic import BaseModel, Field
from typing import Optional, List, Any
from datetime import datetime


class KPIs(BaseModel):
    active_instruments: int = Field(default=0, ge=0)
    amount_held_paise: int = Field(default=0, ge=0)
    amount_at_risk_paise: int = Field(default=0, ge=0)
    expiring_90d: int = Field(default=0, ge=0)
    pending_release: int = Field(default=0, ge=0)
    pending_verification: int = Field(default=0, ge=0)


class MaturityBucket(BaseModel):
    bucket: str = Field(..., description="e.g. 2026-Q4")
    amount_paise: int = Field(..., ge=0)
    count: int = Field(default=0, ge=0)


class ForecastBucket(BaseModel):
    bucket: str = Field(..., description="e.g. 2026-Q4")
    maturing_paise: int = Field(ge=0)
    renewals_paise: int = Field(default=0, ge=0)
    releases_paise: int = Field(default=0, ge=0)
    unresolved_paise: int = Field(default=0, ge=0)


class DashboardPortfolioResponse(BaseModel):
    kpis: KPIs
    maturity_buckets: List[MaturityBucket]
    forecast: ForecastBucket  # labelled "ESTIMATE"
    at_risk: List[Dict[str, Any]]
    recent_activity: List[Dict[str, Any]]


class AtRiskItem(BaseModel):
    instrument_id: str
    instrument_number: str
    institution_name: str
    severity: str  # CRITICAL/SERIOUS/WARNING
    reason: str
    amount_paise: int


class DashboardForecastResponse(BaseModel):
    label: str = Field(default="ESTIMATE")
    buckets: List[ForecastBucket]
    at_risk_paise: int


class PledgeNode(BaseModel):
    id: str
    type: str  # INSTITUTION, INSTRUMENT
    label: str


class PledgeEdge(BaseModel):
    id: str
    from_: str = Field(..., alias="from")
    to: str
    type: str  # PLEDGED_FOR, RENEWED_FROM, SAME_NUMBER, SAME_HASH, SAME_ACCOUNT, SAME_SIGNATORY
    label: str
    confidence: float


class GraphPledgeResponse(BaseModel):
    nodes: List[PledgeNode]
    edges: List[PledgeEdge]


class ReportType(str):
    active = "active"
    expiring = "expiring"
    matured = "matured"
    renewed = "renewed"
    released = "released"
    pending = "pending"
    missing_documents = "missing_documents"
    overdue = "overdue"
    audit = "audit"
    release_turnaround = "release_turnaround"
    forecast = "forecast"


class ReportFilter(BaseModel):
    format: str = Field(default="json", description="json or csv")
    region: Optional[str] = Field(None)
    programme: Optional[str] = Field(None)


class ReportResponse(BaseModel):
    data: Any
    type: ReportType
    generated_at: datetime