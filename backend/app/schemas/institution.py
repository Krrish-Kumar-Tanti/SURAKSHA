from pydantic import BaseModel, Field, UUID4
from typing import Optional, List
from datetime import datetime
from .common import PaginatedResponse, EnumsResponse


class InstitutionCreate(BaseModel):
    aicte_permanent_id: str = Field(..., max_length=20, description="AICTE Permanent ID")
    name: str = Field(..., max_length=500, description="Institution name")
    trust_name: str = Field(..., max_length=500, description="Trust/Society/Company name")
    region_code: str = Field(..., description="Region code")
    state_code: str = Field(..., max_length=10, description="State code")
    district: str = Field(..., description="District")
    location_category: str = Field(..., description="NE/JK/LADAKH/ASPIRATIONAL/AN/LAKSHADWEEP/OTHER")
    institution_type: str = Field(..., description="CO_ED/WOMEN_ONLY/PWD_ONLY")
    building_ownership: str = Field(..., description="OWNED/LEASED")
    university_type: str = Field(..., description="AFFILIATED/PRIVATE_UNIVERSITY/DEEMED/GOVERNMENT")
    application_category: str = Field(..., description="NEW/EXISTING_1_3_3/NEW_LEVEL_PROGRAMME/UNIVERSITY_NEW_PROGRAMME/OTHER")
    established_year: int = Field(..., ge=1947, le=2100, description="Year of establishment")
    regulatory_years: int = Field(default=0, ge=0, description="Years since regulatory recognition")
    ugc_years: int = Field(default=0, ge=0, description="Years with UGC recognition")
    prior_release_noc: bool = Field(default=False, description="Prior release NOC")
    approval_status: str = Field(..., description="Approval status")


class InstitutionUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=500)
    trust_name: Optional[str] = Field(None, max_length=500)
    approval_status: Optional[str] = Field(None)
    prior_release_noc: Optional[bool] = Field(None)


class InstitutionResponse(BaseModel):
    id: str
    aicte_permanent_id: str
    name: str
    trust_name: str
    region_code: str
    state_code: str
    district: str
    location_category: str
    institution_type: str
    building_ownership: str
    university_type: str
    application_category: str
    established_year: int
    regulatory_years: int
    ugc_years: int
    prior_release_noc: bool
    approval_status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class InstitutionListResponse(PaginatedResponse):
    items: List[InstitutionResponse]