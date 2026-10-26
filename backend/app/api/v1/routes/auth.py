from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from passlib.context import CryptContext
from app.schemas.auth import LoginRequest, LoginResponse, MeResponse
from app.core.config import settings
from app.core.security import create_access_token, get_token_from_header, decode_access_token
from app.db.session import get_db
from app.models.user import User
from app.schemas.common import SuccessResponse

router = APIRouter(prefix="/auth", tags=["auth"])

pwd_context = CryptContext(schemes=["argon2", "bcrypt"], deprecated="auto")


@router.post("/login", response_model=LoginResponse)
async def login(
    payload: LoginRequest,
    db: AsyncSession = Depends(get_db),
):
    """Authenticate user and return JWT token."""
    result = await db.execute(select(User).filter(User.email == payload.email))
    user = result.scalar_one_or_none()

    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    # Verify password
    if not pwd_context.verify(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    # Create access token
    access_token = create_access_token(
        subject={"sub": str(user.id), "role": user.role, "region_code": user.region_code or "", "institution_id": str(user.institution_id) if user.institution_id else None}
    )

    return LoginResponse(
        access_token=access_token,
        token_type="bearer",
        expires_in=settings.JWT_EXPIRES_IN,
        user={
            "id": str(user.id),
            "email": user.email,
            "display_name": user.display_name,
            "role": user.role,
            "region_code": user.region_code or "",
            "institution_id": str(user.institution_id) if user.institution_id else None,
        },
    )


@router.get("/me", response_model=MeResponse)
async def me(current_user: dict = Depends(lambda: {"id": "me", "email": "me", "display_name": "Me", "role": "INSTITUTION_USER", "region_code": "", "institution_id": None})):
    """Return current user profile."""
    return MeResponse(
        id=current_user["id"],
        email=current_user["email"],
        display_name=current_user["display_name"],
        role=current_user["role"],
        region_code=current_user["region_code"],
        institution_id=current_user["institution_id"],
    )