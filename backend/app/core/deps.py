from typing import Generator
from fastapi import Depends, Security, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.security import get_token_from_header, decode_access_token
from app.db.session import get_db

bearer_scheme = HTTPBearer(auto_error=False)

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Security(bearer_scheme),
    db: Session = Depends(get_db),
) -> dict:
    """Get the current authenticated user from JWT token."""
    token = get_token_from_header(credentials.credentials) if credentials else None
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    payload = decode_access_token(token)
    user_id: str = payload.get("sub")
    user_role: str = payload.get("role", "")
    user_region: str = payload.get("region_code", "")
    user_inst_id: str | None = payload.get("institution_id")

    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token payload")

    # Fetch user from DB to verify existence and active status
    from app.models.user import User
    user = db.query(User).filter(User.id == user_id).first()
    if not user or not user.is_active:
        raise HTTPException(status_code=401, detail="User inactive or removed")

    return {
        "id": user.id,
        "email": user.email,
        "display_name": user.display_name,
        "role": user.role,
        "region_code": user.region_code,
        "institution_id": user.institution_id,
    }


def get_current_institution_user(
    current_user: dict = Depends(get_current_user),
) -> dict:
    """Restrict to INSTITUTION_USER role only."""
    if current_user["role"] != "INSTITUTION_USER":
        raise HTTPException(status_code=403, detail="Institution users only")
    return current_user


def get_current_dealing_officer(
    current_user: dict = Depends(get_current_user),
) -> dict:
    """Restrict to DEALING_OFFICER or DIRECTOR_RB."""
    if current_user["role"] not in ("DEALING_OFFICER", "DIRECTOR_RB"):
        raise HTTPException(status_code=403, detail="Dealing officer required")
    return current_user


def get_current_director_rb(
    current_user: dict = Depends(get_current_user),
) -> dict:
    """Restrict to DIRECTOR_RB."""
    if current_user["role"] != "DIRECTOR_RB":
        raise HTTPException(status_code=403, detail="Director RB required")
    return current_user


def get_current_competent_authority(
    current_user: dict = Depends(get_current_user),
) -> dict:
    """Restrict to COMPETENT_AUTHORITY."""
    if current_user["role"] != "COMPETENT_AUTHORITY":
        raise HTTPException(status_code=403, detail="Competent authority required")
    return current_user


def get_current_auditor(
    current_user: dict = Depends(get_current_user),
) -> dict:
    """Restrict to AUDITOR."""
    if current_user["role"] != "AUDITOR":
        raise HTTPException(status_code=403, detail="Auditor required")
    return current_user


def get_current_admin(
    current_user: dict = Depends(get_current_user),
) -> dict:
    """Restrict to ADMIN."""
    if current_user["role"] != "ADMIN":
        raise HTTPException(status_code=403, detail="Admin required")
    return current_user