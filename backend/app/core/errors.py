from fastapi import HTTPException, Request as FastAPIRequest
from fastapi.responses import JSONResponse
from starlette import status
from typing import Any, Dict

# Canonical error codes ( §5.7 )
class ErrorCodes:
    AUTH_INVALID = "AUTH_INVALID"
    AUTH_EXPIRED = "AUTH_EXPIRED"
    FORBIDDEN = "FORBIDDEN"
    NOT_FOUND = "NOT_FOUND"
    VALIDATION_ERROR = "VALIDATION_ERROR"
    STATE_CONFLICT = "STATE_CONFLICT"
    RELEASE_BLOCKED = "RELEASE_BLOCKED"
    DUPLICATE_INSTRUMENT = "DUPLICATE_INSTRUMENT"
    DUPLICATE_FILE = "DUPLICATE_FILE"
    POLICY_COMBINATION_INVALID = "POLICY_COMBINATION_INVALID"
    POLICY_AMBIGUOUS = "POLICY_AMBIGUOUS"
    SOURCE_UNAVAILABLE = "SOURCE_UNAVAILABLE"
    BANK_NOT_FOUND = "BANK_NOT_FOUND"
    AUDIT_CHAIN_BROKEN = "AUDIT_CHAIN_BROKEN"
    RATE_LIMITED = "RATE_LIMITED"


def http_error(code: str, message: str, details: Dict[str, Any] | None = None, status_code: int = status.HTTP_400_BAD_REQUEST):
    """Build a standardized error response."""
    body = {"error": {"code": code, "message": message, "details": details or {}, "trace_id": ""}}
    return JSONResponse(status_code=status_code, content=body)


# Pre-built error handlers

def auth_invalid():
    return http_error(ErrorCodes.AUTH_INVALID, "Authentication required", status_code=status.HTTP_401_UNAUTHORIZED)


def auth_expired():
    return http_error(ErrorCodes.AUTH_EXPIRED, "Authentication expired", status_code=status.HTTP_401_UNAUTHORIZED)


def forbidden(detail: str = "Forbidden"):
    return http_error(ErrorCodes.FORBIDDEN, detail, status_code=status.HTTP_403_FORBIDDEN)


def not_found(resource: str = "Resource", id: str | None = None):
    msg = f"{resource} not found"
    details = {}
    if id:
        details["id"] = id
    return http_error(ErrorCodes.NOT_FOUND, msg, details, status_code=status.HTTP_404_NOT_FOUND)


def validation_error(message: str, details: Dict[str, Any] | None = None):
    return http_error(ErrorCodes.VALIDATION_ERROR, message, details, status_code=status.HTTP_400_BAD_REQUEST)


def release_blocked(blockers: list[str] | None = None):
    return http_error(
        ErrorCodes.RELEASE_BLOCKED,
        "Release cannot be approved until the required clearances, the 10-year term, and the critical-discrepancy check are satisfied.",
        {"blockers": blockers or []},
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
    )


def duplicate_instrument():
    return http_error(ErrorCodes.DUPLICATE_INSTRUMENT, "An instrument with this number already exists.", status_code=status.HTTP_409_CONFLICT)


def policy_combination_invalid(programme: str, level: str):
    return http_error(
        ErrorCodes.POLICY_COMBINATION_INVALID,
        f"Invalid programme/level combination: {programme}/{level}.",
        status_code=status.HTTP_400_BAD_REQUEST,
    )


def audit_chain_broken():
    return http_error(ErrorCodes.AUDIT_CHAIN_BROKEN, "Audit chain is broken; data integrity at risk.", status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)


def rate_limited(retry_after: int = 60):
    return http_error(
        ErrorCodes.RATE_LIMITED,
        "Too many requests; please retry later.",
        {"retry_after": retry_after},
        status_code=status.HTTP_429_TOO_MANY_REQUESTS,
    )