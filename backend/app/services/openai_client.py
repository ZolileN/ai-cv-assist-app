import os
import json
import logging
from typing import Any, Dict, List, Optional

from openai import OpenAI

logger = logging.getLogger(__name__)

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise RuntimeError("OPENAI_API_KEY is not set in environment")

_client = OpenAI(api_key=OPENAI_API_KEY)


def _safe_parse_json(text: str) -> Optional[Dict[str, Any]]:
    try:
        return json.loads(text)
    except Exception:
        # sometimes model returns text with backticks or explanation; try to extract first JSON blob
        start = text.find("{")
        end = text.rfind("}")
        if start != -1 and end != -1 and end > start:
            try:
                return json.loads(text[start : end + 1])
            except Exception:
                logger.exception("Failed to parse JSON from model output")
        return None


def rewrite_bullet(text: str) -> Dict[str, Any]:
    """
    Rewrites a single bullet or short paragraph into a concise, impact-focused bullet.
    Returns a dict with keys: original, rewritten, metadata (optional).
    Uses model: gpt-4o-mini
    """
    prompt = (
        "You are a professional resume writer. Rewrite the following input into a single, "
        "concise, achievement-oriented bullet (1 sentence, active voice, quantify when possible). "
        "Output only valid JSON with keys: original, rewritten, notes.\n\n"
        f"Input: {text}"
    )

    resp = _client.chat.completions.create(model="gpt-4o-mini", messages=[{"role": "user", "content": prompt}], max_tokens=400)
    raw = resp.choices[0].message.content
    parsed = _safe_parse_json(raw.strip()) if raw else None

    if parsed:
        return parsed
    # fallback: try to extract plain text and return minimal structure
    rewritten = (raw.strip() if raw else text) or text
    return {"original": text, "rewritten": rewritten, "notes": None}


def analyze_job_description(text: str) -> Dict[str, Any]:
    """
    Analyze a job description and return structured information:
    {
      title_suggestion: str,
      seniority: str,
      top_skills: [str],
      responsibilities: [str],
      must_have_experience_years: int | null,
      nice_to_have: [str],
      summary: str
    }
    Uses model: gpt-4o-mini and returns parsed JSON.
    """
    schema_instructions = (
        "Return valid JSON with these keys: "
        "title_suggestion (string), seniority (e.g. Junior/Mid/Senior/Lead), "
        "top_skills (array of strings), responsibilities (array of short strings), "
        "must_have_experience_years (integer or null), nice_to_have (array), summary (string). "
        "Do not include any extra keys."
    )

    prompt = (
        "You are an expert recruiter / job-analyst. Analyze the job description below and "
        "produce the JSON described.\n\n"
        f"{schema_instructions}\n\nJob description:\n{text}"
    )

    resp = _client.chat.completions.create(model="gpt-4o-mini", messages=[{"role": "user", "content": prompt}], max_tokens=700)
    raw = resp.choices[0].message.content
    parsed = _safe_parse_json(raw.strip()) if raw else None

    if parsed:
        return parsed

    # fallback minimal analysis
    return {
        "title_suggestion": "",
        "seniority": "",
        "top_skills": [],
        "responsibilities": [],
        "must_have_experience_years": None,
        "nice_to_have": [],
        "summary": text[:400],
    }


def generate_embedding(text: str) -> Dict[str, Any]:
    """
    Create an embedding for `text` using model text-embedding-3-small.
    Returns dict: { embedding: [float], model: str, usage: {...} }
    """
    try:
        resp = _client.embeddings.create(model="text-embedding-3-small", input=text)
        # resp.data is a list; take first item
        data = resp.data[0]
        return {
            "embedding": data.embedding,
            "model": getattr(resp, "model", "text-embedding-3-small"),
            "usage": getattr(resp, "usage", None),
        }
    except Exception as e:
        logger.exception("Embedding generation failed")
        raise