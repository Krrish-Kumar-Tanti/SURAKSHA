from pydantic import BaseModel, Field, UUID4
from typing import Optional, List, Dict, Any, Union
from datetime import datetime


class PolicyPackCreate(BaseModel):
    label: str = Field(..., max_length=100, description="Human-readable pack label")
    academic_year: str = Field(..., max_length=15, description="e.g. 2024-27, 2026-27")
    source_url: str = Field(..., description="Official source URL")
    effective_from: Optional[datetime] = Field(None, description="Start date")
    effective_to: Optional[datetime] = Field(None, description="End date")
    status: str = Field(default="ACTIVE", description="ACTIVE|DRAFT|BLOCKED")


class PolicyPackResponse(BaseModel):
    id: str
    label: str
    academic_year: str
    source_url: str
    effective_from: Optional[datetime]
    effective_to: Optional[datetime]
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


class PolicyRuleCreate(BaseModel):
    rule_key: str = Field(..., max_length=50, description="Unique key within pack")
    clause: str = Field(..., description="APH clause reference")
    description: str = Field(..., description="Human-readable rule description")
    rule_type: str = Field(..., description="e.g. concession, multiplier, exemption")
    payload_json: Optional[Dict[str, Any]] = Field(default={}, description="Additional rule parameters")
    source_excerpt: str = Field(..., description="Text excerpt from the handbook")
    source_url: str = Field(..., description="Source URL for the excerpt")
    effective_from: Optional[datetime] = Field(None)
    effective_to: Optional[datetime] = Field(None)
    status: str = Field(default="ACTIVE", description="ACTIVE|DRAFT|BLOCKED")


class PolicyRuleResponse(BaseModel):
    id: str
    rule_key: str
    clause: str
    description: str
    rule_type: str
    payload_json: Dict[str, Any]
    source_excerpt: str
    source_url: str
    effective_from: Optional[datetime]
    effective_to: Optional[datetime]
    status: str

    class Config:
        from_attributes = True


class PolicyCalculateRequest(BaseModel):
    institution_id: UUID4 = Field(..., description="Institution UUID")
    programme_id: UUID4 = Field(..., description="Programme UUID")
    level: str = Field(..., description="DIPLOMA/UG/PG")
    academic_year: str = Field(..., description="e.g. 2026-27")
    existing_credit_paise: int = Field(default=0, ge=0, description="Existing credit in paise")


class PolicyCalculateResponse(BaseModel):
    base_amount_paise: int
    concession_factor: float  # e.g. 0.5000
    leased_multiplier: float  # e.g. 2.00
    exemption_applied: bool
    exemption_reason: Optional[str]
    required_amount_paise: int
    trace: List[Dict[str, Any]]
    computed_at: datetime

    class Config:
        from_attributes = True


class PolicyDiffResponse(BaseModel):
    base_pack: PolicyPackResponse
    overlay_pack: PolicyPackResponse
    rules_differ: List[Dict[str, Any]]
    effective_changes: List[Dict[str, Any]]