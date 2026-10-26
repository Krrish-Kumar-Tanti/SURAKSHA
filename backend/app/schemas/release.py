from pydantic import BaseModel, Field, UUID4
from typing import Optional, List, Dict, Any, Union
from datetime import datetime


class ReleaseRequestCreate(BaseModel):
    instrument_id: UUID4 = Field(..., description="Instrument UUID")
    request_type: str = Field(..., description="MATURITY/EARLY/CLOSURE/PROGRESSIVE_CLOSURE/MERGER")
    financial_embezzlement_flag: bool = Field(default=False, description="Financial embezzlement flag")
    notes: Optional[str] = Field(None, description="Free-text notes")


class ReleaseRequestUpdate(BaseModel):
    status: Optional[str] = Field(None)
    noc_number: Optional[str] = Field(None)
    sanction_order_number: Optional[str] = Field(None)
    notes: Optional[str] = Field(None)


class ReleaseRequestResponse(BaseModel):
    id: str
    instrument_id: str
    institution_id: str
    request_type: str
    financial_embezzlement_flag: bool
    requested_at: datetime
    status: str
    eligibility_result: Optional[str]
    decision: Optional[str]
    decided_at: Optional[datetime]
    noc_number: Optional[str]
    sanction_order_number: Optional[str]
    notes: Optional[str]

    class Config:
        from_attributes = True


class ReleaseRequestEligibilityResponse(BaseModel):
    release_request_id: str
    result: str  # ELIGIBLE, BLOCKED, NEEDS_INFO, PENDING_SOURCE
    nodes: List[Dict[str, Any]]
    blockers: List[str]
    evaluated_at: datetime