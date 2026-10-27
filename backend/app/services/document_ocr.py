import asyncio
from typing import Any

from app.core.config import Settings
from app.models.document import Document
from app.services.document_storage import read_encrypted_document
from app.services.gemini_document_ocr import (
    GeminiOCRError,
    extract_fields_with_gemini,
)


class OCRConfigurationError(RuntimeError):
    pass


async def extract_document_fields(
    document: Document, settings: Settings
) -> list[dict[str, Any]]:
    if not settings.GEMINI_API_KEY:
        raise OCRConfigurationError(
            "Gemini OCR is not configured. Set GEMINI_API_KEY in backend/.env."
        )

    content = await asyncio.to_thread(
        read_encrypted_document,
        document.storage_key,
        document.sha256,
        document.encryption_meta,
        settings.DOCUMENT_STORAGE_DIR,
        settings.DOCUMENT_MASTER_KEY,
    )
    return await extract_fields_with_gemini(
        content,
        document.mime_type,
        settings.GEMINI_API_KEY,
        settings.GEMINI_OCR_MODEL,
    )