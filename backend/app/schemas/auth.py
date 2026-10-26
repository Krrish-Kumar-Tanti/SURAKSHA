from pydantic import BaseModel, Field, EmailStr
from typing import Optional


class LoginRequest(BaseModel):
    email: EmailStr = Field(..., description="User email")
    password: str = Field(..., min_length=6, description="User password")


class LoginResponse(BaseModel):
    access_token: str = Field(..., description="JWT bearer token")
    token_type: str = Field(default="bearer", description="Token type")
    expires_in: int = Field(default=3600, description="Seconds until expiry")
    user: dict = Field(..., description="User profile")


class MeResponse(BaseModel):
    id: str
    email: str
    display_name: str
    role: str
    region_code: str
    institution_id: Optional[str] = None


class TokenData(BaseModel):
    sub: Optional[str] = None
    role: Optional[str] = None
    region_code: Optional[str] = None
    institution_id: Optional[str] = None