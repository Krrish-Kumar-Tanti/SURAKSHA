import base64
import binascii
import os
import secrets
import tempfile
from pathlib import Path
from typing import Any

from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.exceptions import InvalidTag


class DocumentStorageConfigurationError(ValueError):
    pass


class DocumentStorageError(RuntimeError):
    pass


def _decode_master_key(encoded_key: str) -> bytes:
    try:
        key = base64.b64decode(encoded_key, validate=True)
    except (binascii.Error, ValueError, TypeError) as exc:
        raise DocumentStorageConfigurationError(
            "DOCUMENT_MASTER_KEY must be base64-encoded."
        ) from exc
    if len(key) != 32:
        raise DocumentStorageConfigurationError(
            "DOCUMENT_MASTER_KEY must decode to exactly 32 bytes."
        )
    return key


def store_encrypted_document(
    content: bytes,
    sha256: str,
    storage_dir: str,
    encoded_master_key: str,
) -> tuple[str, dict[str, Any]]:
    master_key = _decode_master_key(encoded_master_key)
    data_key = secrets.token_bytes(32)
    file_nonce = secrets.token_bytes(12)
    wrapped_key_nonce = secrets.token_bytes(12)
    associated_data = sha256.encode("ascii")
    encrypted_content = AESGCM(data_key).encrypt(file_nonce, content, associated_data)
    wrapped_key = AESGCM(master_key).encrypt(
        wrapped_key_nonce, data_key, associated_data
    )

    directory = Path(storage_dir)
    directory.mkdir(parents=True, exist_ok=True)
    storage_key = f"doc_{sha256}.enc"
    destination = directory / storage_key
    temporary_path: str | None = None
    try:
        with tempfile.NamedTemporaryFile(dir=directory, delete=False) as temporary:
            temporary_path = temporary.name
            temporary.write(encrypted_content)
        os.replace(temporary_path, destination)
    finally:
        if temporary_path and os.path.exists(temporary_path):
            os.unlink(temporary_path)

    encryption_meta = {
        "mode": "AES-256-GCM",
        "file_nonce": base64.b64encode(file_nonce).decode("ascii"),
        "wrapped_key_nonce": base64.b64encode(wrapped_key_nonce).decode("ascii"),
        "wrapped_key": base64.b64encode(wrapped_key).decode("ascii"),
    }
    return storage_key, encryption_meta


def read_encrypted_document(
    storage_key: str,
    sha256: str,
    encryption_meta: dict[str, Any],
    storage_dir: str,
    encoded_master_key: str,
) -> bytes:
    if storage_key != f"doc_{sha256}.enc":
        raise ValueError("Invalid document storage key.")

    try:
        file_nonce = base64.b64decode(encryption_meta["file_nonce"], validate=True)
        wrapped_key_nonce = base64.b64decode(
            encryption_meta["wrapped_key_nonce"], validate=True
        )
        wrapped_key = base64.b64decode(encryption_meta["wrapped_key"], validate=True)
    except (KeyError, ValueError, TypeError) as exc:
        raise ValueError("Document encryption metadata is invalid.") from exc

    associated_data = sha256.encode("ascii")
    try:
        master_key = _decode_master_key(encoded_master_key)
        data_key = AESGCM(master_key).decrypt(
            wrapped_key_nonce, wrapped_key, associated_data
        )
        encrypted_content = (Path(storage_dir) / storage_key).read_bytes()
        return AESGCM(data_key).decrypt(file_nonce, encrypted_content, associated_data)
    except (InvalidTag, OSError) as exc:
        raise DocumentStorageError(
            "Stored document is missing or failed its integrity check."
        ) from exc