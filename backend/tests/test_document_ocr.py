import asyncio
import base64
import hashlib
import json
import os
from unittest.mock import AsyncMock, patch

import httpx
import pytest

from app.services.document_storage import (
    DocumentStorageConfigurationError,
    read_encrypted_document,
    store_encrypted_document,
)
from app.services.gemini_document_ocr import (
    GeminiOCRError,
    _parse_fields,
    extract_fields_with_gemini,
)


def _encoded_master_key() -> str:
    return base64.b64encode(os.urandom(32)).decode("ascii")


def test_document_storage_encrypts_and_round_trips(tmp_path):
    source = b"%PDF-1.7 private receipt contents"
    master_key = _encoded_master_key()
    sha256 = hashlib.sha256(source).hexdigest()

    storage_key, metadata = store_encrypted_document(
        source, sha256, str(tmp_path), master_key
    )

    encrypted_path = tmp_path / storage_key
    assert encrypted_path.read_bytes() != source
    assert read_encrypted_document(
        storage_key, sha256, metadata, str(tmp_path), master_key
    ) == source


def test_document_storage_rejects_invalid_master_key(tmp_path):
    with pytest.raises(DocumentStorageConfigurationError):
        store_encrypted_document(b"receipt", "a" * 64, str(tmp_path), "invalid")


def test_gemini_response_parser_keeps_supported_evidence():
    fields = _parse_fields(
        {
            "candidates": [
                {
                    "content": {
                        "parts": [
                            {
                                "text": json.dumps(
                                    {
                                        "fields": [
                                            {
                                                "field_name": "amount",
                                                "document_value": "₹70,00,000",
                                                "confidence": 0.94,
                                                "page": 1,
                                                "bbox": {
                                                    "x": 0.1,
                                                    "y": 0.2,
                                                    "w": 0.3,
                                                    "h": 0.04,
                                                },
                                            },
                                            {
                                                "field_name": "unknown",
                                                "document_value": "ignored",
                                                "confidence": 1,
                                            },
                                        ]
                                    }
                                )
                            }
                        ]
                    }
                }
            ]
        }
    )

    assert fields == [
        {
            "field_name": "amount",
            "document_value": "₹70,00,000",
            "confidence": 0.94,
            "page": 1,
            "bbox": {"x": 0.1, "y": 0.2, "w": 0.3, "h": 0.04},
        }
    ]


def test_gemini_request_sends_file_to_provider_without_exposing_key_in_url():
    response = httpx.Response(
        200,
        json={
            "candidates": [
                {
                    "content": {
                        "parts": [
                            {
                                "text": '{"fields":[{"field_name":"ifsc","document_value":"SBIN0001482","confidence":0.9}]}'
                            }
                        ]
                    }
                }
            ]
        },
        request=httpx.Request("POST", "https://generativelanguage.googleapis.com"),
    )
    with patch.object(
        httpx.AsyncClient, "post", new=AsyncMock(return_value=response)
    ) as post:
        fields = asyncio.run(
            extract_fields_with_gemini(
                b"%PDF-test", "application/pdf", "test-secret", "gemini-test"
            )
        )

    assert fields[0]["field_name"] == "ifsc"
    args, kwargs = post.call_args
    assert "test-secret" not in args[0]
    assert kwargs["headers"]["x-goog-api-key"] == "test-secret"
    assert (
        kwargs["json"]["contents"][0]["parts"][1]["inline_data"]["mime_type"]
        == "application/pdf"
    )


def test_gemini_invalid_response_is_explicit():
    with pytest.raises(GeminiOCRError, match="unreadable OCR response"):
        _parse_fields({"candidates": []})