import base64
import json
import math
from typing import Any

import httpx


FIELD_NAMES = (
    "amount",
    "instrument_number",
    "issue_date",
    "maturity_date",
    "bank_name",
    "branch",
    "ifsc",
    "depositor",
    "lien",
)


class GeminiOCRError(RuntimeError):
    pass


def _parse_fields(response_data: dict[str, Any]) -> list[dict[str, Any]]:
    try:
        text = "".join(
            part["text"]
            for part in response_data["candidates"][0]["content"]["parts"]
            if isinstance(part.get("text"), str)
        )
        payload = json.loads(text)
    except (KeyError, IndexError, TypeError, ValueError) as exc:
        raise GeminiOCRError("Gemini returned an unreadable OCR response.") from exc

    raw_fields = payload.get("fields") if isinstance(payload, dict) else None
    if not isinstance(raw_fields, list):
        raise GeminiOCRError("Gemini returned OCR data in an unsupported format.")

    parsed_fields: list[dict[str, Any]] = []
    seen_fields: set[str] = set()
    for item in raw_fields:
        if not isinstance(item, dict):
            continue
        field_name = item.get("field_name")
        if field_name not in FIELD_NAMES or field_name in seen_fields:
            continue
        seen_fields.add(field_name)

        value = item.get("document_value")
        if value is not None and (
            isinstance(value, bool) or not isinstance(value, (str, int, float))
        ):
            continue
        if isinstance(value, float) and not math.isfinite(value):
            continue
        value = str(value).strip() if value is not None else None
        if not value:
            continue

        try:
            confidence = float(item.get("confidence", 0))
        except (TypeError, ValueError):
            confidence = 0
        if not 0 <= confidence <= 1:
            confidence = 0

        page = item.get("page")
        if not isinstance(page, int) or page < 1:
            page = None

        bbox = item.get("bbox")
        if isinstance(bbox, dict):
            try:
                coordinates = {
                    key: float(bbox[key]) for key in ("x", "y", "w", "h")
                }
            except (KeyError, TypeError, ValueError):
                coordinates = {}
            if (
                len(coordinates) != 4
                or any(not math.isfinite(value) for value in coordinates.values())
                or any(value < 0 or value > 1 for value in coordinates.values())
                or coordinates["x"] + coordinates["w"] > 1
                or coordinates["y"] + coordinates["h"] > 1
            ):
                bbox = None
            else:
                bbox = coordinates
        else:
            bbox = None

        parsed_fields.append(
            {
                "field_name": field_name,
                "document_value": value,
                "confidence": confidence,
                "page": page,
                "bbox": bbox,
            }
        )
    return parsed_fields


async def extract_fields_with_gemini(
    content: bytes,
    mime_type: str,
    api_key: str,
    model: str,
) -> list[dict[str, Any]]:
    prompt = (
        "Read this FDR/security-deposit document. Extract only values visibly "
        "present in the document; do not infer missing values. Return JSON only "
        "with this shape: {\"fields\":[{\"field_name\":\"amount|"
        "instrument_number|issue_date|maturity_date|bank_name|branch|ifsc|"
        "depositor|lien\",\"document_value\":\"string\",\"confidence\":0.0,"
        "\"page\":1,\"bbox\":{\"x\":0.0,\"y\":0.0,\"w\":0.0,\"h\":0.0}}]}. "
        "Use null for page or bbox when unavailable. Coordinates are normalized "
        "from 0 to 1 relative to the page. Omit fields that are not readable."
    )
    endpoint = (
        "https://generativelanguage.googleapis.com/v1beta/models/"
        f"{model}:generateContent"
    )
    request_body = {
        "contents": [
            {
                "parts": [
                    {"text": prompt},
                    {
                        "inline_data": {
                            "mime_type": mime_type,
                            "data": base64.b64encode(content).decode("ascii"),
                        }
                    },
                ]
            }
        ],
        "generationConfig": {"responseMimeType": "application/json"},
    }

    try:
        async with httpx.AsyncClient(timeout=90) as client:
            response = await client.post(
                endpoint,
                headers={"x-goog-api-key": api_key},
                json=request_body,
            )
    except httpx.TimeoutException as exc:
        raise GeminiOCRError("Gemini OCR request timed out.") from exc
    except httpx.RequestError as exc:
        raise GeminiOCRError("Gemini OCR service could not be reached.") from exc

    if not response.is_success:
        raise GeminiOCRError(
            f"Gemini OCR request failed with HTTP {response.status_code}."
        )
    try:
        response_data = response.json()
    except ValueError as exc:
        raise GeminiOCRError("Gemini returned invalid JSON.") from exc
    return _parse_fields(response_data)