# Unnati Sharma — Security Config (§7.3)
# File: core/security_config.md
# SURAKSHA SIH26265 — Backend Deliverable

## Passwords
- Argon2id or bcrypt cost 12; never log.

## JWT
- Secret from `.env`; 1-hour expiry; no refresh token in prototype.
- Claims: sub, role, region_code, institution_id, exp, iat.

## Documents
- AES-256-GCM; unique nonce; key from `.env` (`DOCUMENT_MASTER_KEY`).
- No public bucket; signed short-lived download endpoint only.

## PII / Logs
- Mask account numbers and emails in logs; no raw request bodies in logs.
- Audit events must not contain secrets or full document text.

## CORS / Rate Limit
- Only configured frontend origin (`CORS_ORIGINS`).
- Rate limit login and upload endpoints.

## External Adapters
- All have timeouts; never block request indefinitely.
- Every adapter exposes mode: SANDBOX, MOCK, SIMULATED.
