import base64
import hashlib
import os
from uuid import UUID

from cryptography.exceptions import InvalidTag
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

from app.core.config import settings


def encrypt_document(document_id: UUID, content: bytes) -> tuple[bytes, dict[str, str]]:
    if settings.APP_ENV == "production" and settings.DOCUMENT_MASTER_KEY == "dev-master-key-32-byte-base64==":
        raise RuntimeError("DOCUMENT_MASTER_KEY must be configured in production.")

    key = hashlib.sha256(settings.DOCUMENT_MASTER_KEY.encode("utf-8")).digest()
    nonce = os.urandom(12)
    ciphertext = AESGCM(key).encrypt(nonce, content, document_id.bytes)
    return ciphertext, {
        "mode": "AES-256-GCM",
        "nonce": base64.b64encode(nonce).decode("ascii"),
    }


def decrypt_document(document_id: UUID, ciphertext: bytes, metadata: dict) -> bytes:
    if metadata.get("mode") != "AES-256-GCM":
        raise ValueError("Document encryption metadata is invalid.")

    nonce = base64.b64decode(metadata["nonce"], validate=True)
    if len(nonce) != 12:
        raise ValueError("Document encryption nonce is invalid.")

    key = hashlib.sha256(settings.DOCUMENT_MASTER_KEY.encode("utf-8")).digest()
    try:
        return AESGCM(key).decrypt(nonce, ciphertext, document_id.bytes)
    except InvalidTag as exc:
        raise ValueError("Document authentication failed.") from exc
