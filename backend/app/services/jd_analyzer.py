import logging
from typing import Any, Dict, List

from pydantic import BaseModel, Field, ValidationError

from .openai_client import _client, _safe_parse_json

logger = logging.getLogger(__name__)


class JDAnalysis(BaseModel):
    hard_skills: List[str] = Field(default_factory=list)
    soft_skills: List[str] = Field(default_factory=list)
    tools: List[str] = Field(default_factory=list)
    seniority: str = ""


def analyze_jd(text: str) -> Dict[str, Any]:
    """
    Extract structured fields from a job description and return validated JSON:
    {
      hard_skills: [],
      soft_skills: [],
      tools: [],
      seniority: ""
    }
    """
    prompt = (
        "Extract structured JSON from the job description.\n"
        "Return only valid JSON with exactly these keys:\n"
        "{\n"
        '  "hard_skills": [],\n'
        '  "soft_skills": [],\n'
        '  "tools": [],\n'
        '  "seniority": ""\n'
        "}\n"
        "Rules:\n"
        "- Keep values concise.\n"
        "- Arrays must contain unique strings.\n"
        "- If unknown, return empty arrays and empty seniority.\n\n"
        f"Job description:\n{text}"
    )

    raw = None
    try:
        resp = _client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
            max_tokens=500,
        )
        raw = resp.choices[0].message.content if resp.choices else None
        parsed = _safe_parse_json(raw.strip()) if raw else None
    except Exception:
        logger.exception("JD analysis request failed")
        parsed = None

    if not isinstance(parsed, dict):
        parsed = {}

    # Keep only the required shape before validation.
    normalized = {
        "hard_skills": parsed.get("hard_skills", []),
        "soft_skills": parsed.get("soft_skills", []),
        "tools": parsed.get("tools", []),
        "seniority": parsed.get("seniority", ""),
    }

    try:
        validated = JDAnalysis.model_validate(normalized)
        return validated.model_dump()
    except ValidationError:
        logger.exception("Invalid JD analysis payload; returning safe default")
        return JDAnalysis().model_dump()
