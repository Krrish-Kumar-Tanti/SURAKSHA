from pydantic import BaseModel, Field, UUID4
from typing import Optional, List, Dict, Any
from datetime import datetime


class UUIDstr(str):
    """Pydantic v2 string that validates as UUID."""
    pass


class SuccessResponse(BaseModel):
    success: bool = True
    trace_id: str = Field(default_factory=lambda: f"req_{datetime.utcnow().strftime('%Y%m%d%H%M%S')}")


class ErrorResponse(BaseModel):
    error: Dict[str, str]


class PaginationMeta(BaseModel):
    limit: int = Field(default=50, ge=1, le=200)
    offset: int = Field(default=0, ge=0)
    total: int = Field(default=0, ge=0)


class PaginatedResponse(BaseModel):
    items: List[Any]
    meta: PaginationMeta


# Audit schema
class AuditEventSummary(BaseModel):
    seq: int
    event_type: str
    entity_type: str
    entity_id: str
    actor_role: Optional[str] = None
    created_at: datetime
    hash: str  # first 16 chars for summary


# Enum response
class EnumsResponse(BaseModel):
    roles: List[str]
    institution_type: List[str]
    location_category: List[str]
    building_ownership: List[str]
    university_type: List[str]
    application_category: List[str]
    programme: List[str]
    level: List[str]
    instrument_type: List[str]
    instrument_status: List[str]
    verification_status: List[str]
    bank_verification_status: List[str]
    finding_severity: List[str]
    finding_disposition: List[str]
    obligation_type: List[str]
    obligation_status: List[str]
    release_request_type: List[str]
    release_status: List[str]
    eligibility_result: List[str]
    clearance_type: List[str]
    clearance_status: List[str]
    release_decision: List[str]
    pledge_edge_type: List[str]
    alert_type: List[str]
    audit_entity_type: List[str]