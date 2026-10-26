from pydantic import BaseModel, Field, UUID4
from typing import Optional, List, Dict, Any
from datetime import datetime
from .common import EnumsResponse, PaginatedResponse


class InstrumentCreate(BaseModel):
    institution_id: UUID4 = Field(..., description="Institution UUID")
    programme_id: UUID4 = Field(..., description="Programme UUID")
    type: str = Field(..., description="FDR/RTGS/RPGF/BG")
    instrument_number: str = Field(..., max_length=100, description="Instrument number")
    bank_name: str = Field(..., max_length=200, description="Bank name")
    branch: str = Field(..., max_length=200, description="Branch name")
    ifsc: str = Field(..., max_length=20, description="IFSC code")
    amount_paise: int = Field(..., gt=0, description="Amount in paise (integer)")
    issue_date: datetime = Field(..., description="Issue date YYYY-MM-DD")
    maturity_date: datetime = Field(..., description="Maturity date YYYY-MM-DD")
    tenure_months: int = Field(..., gt=0, description="Tenure in months")
    interest_rate: Optional[float] = Field(None, ge=0, le=20, description="Interest rate percentage")
    depositor_name: str = Field(..., max_length=500, description="Depositor/trust name")
    lien_in_favour: str = Field(..., max_length=200, description="e.g. AICTE")


class InstrumentUpdate(BaseModel):
    type: Optional[str] = Field(None)
    instrument_number: Optional[str] = Field(None)
    bank_name: Optional[str] = Field(None)
    branch: Optional[str] = Field(None)
    ifsc: Optional[str] = Field(None)
    amount_paise: Optional[int] = Field(None, gt=0)
    issue_date: Optional[datetime] = Field(None)
    maturity_date: Optional[datetime] = Field(None)
    tenure_months: Optional[int] = Field(None)
    interest_rate: Optional[float] = Field(None, ge=0, le=20)
    depositor_name: Optional[str] = Field(None, max_length=500)
    lien_in_favour: Optional[str] = Field(None)
    status: Optional[str] = Field(None)


class InstrumentResponse(BaseModel):
    id: str
    institution_id: str
    programme_id: Optional[str]
    type: str
    instrument_number: str
    bank_name: str
    branch: str
    ifsc: str
    amount_paise: int
    issue_date: datetime
    maturity_date: datetime
    tenure_months: int
    interest_rate: Optional[float]
    depositor_name: str
    lien_in_favour: str
    status: str
    verification_status: str
    officer_verified: bool
    predecessor_id: Optional[str]
    successor_id: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class InstrumentListResponse(PaginatedResponse):
    items: List[InstrumentResponse]


class InstrumentProvenanceResponse(BaseModel):
    instrument_id: str
    verification_status: str
    fields: List[Dict[str, Any]]
    findings: List[Dict[str, Any]]