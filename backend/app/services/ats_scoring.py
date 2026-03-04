import re
from typing import Any, Dict, Iterable, List, Set

from pydantic import BaseModel


VAGUE_PHRASES = (
    "responsible for",
    "assisted with",
)

SECTION_KEYS = (
    "title",
    "summary",
    "experiences",
    "skills",
    "tools",
    "education",
)


class ATSScoreResult(BaseModel):
    ats_score: float
    keyword_score: float
    impact_score: float


def _normalize_items(values: Iterable[Any]) -> Set[str]:
    normalized: Set[str] = set()
    for value in values:
        if value is None:
            continue
        if isinstance(value, str):
            text = value.strip().lower()
            if text:
                normalized.add(text)
        else:
            text = str(value).strip().lower()
            if text:
                normalized.add(text)
    return normalized


def _split_maybe_csv(value: Any) -> List[str]:
    if value is None:
        return []
    if isinstance(value, list):
        return [str(v) for v in value if str(v).strip()]
    if isinstance(value, str):
        # Split on commas, semicolons, or new lines.
        parts = re.split(r"[,;\n]", value)
        return [p.strip() for p in parts if p.strip()]
    return [str(value).strip()] if str(value).strip() else []


def _extract_cv_tools(cv_data: Dict[str, Any]) -> Set[str]:
    tools: List[str] = []
    tools.extend(_split_maybe_csv(cv_data.get("tools")))
    tools.extend(_split_maybe_csv(cv_data.get("skills")))

    experiences = cv_data.get("experiences", [])
    if isinstance(experiences, list):
        for exp in experiences:
            if not isinstance(exp, dict):
                continue
            tools.extend(_split_maybe_csv(exp.get("tools")))

    return _normalize_items(tools)


def _extract_jd_skills(jd_data: Dict[str, Any]) -> Set[str]:
    jd_skills: List[str] = []
    jd_skills.extend(_split_maybe_csv(jd_data.get("hard_skills")))
    jd_skills.extend(_split_maybe_csv(jd_data.get("tools")))
    return _normalize_items(jd_skills)


def _collect_achievement_texts(cv_data: Dict[str, Any]) -> List[str]:
    texts: List[str] = []
    experiences = cv_data.get("experiences", [])
    if not isinstance(experiences, list):
        return texts

    for exp in experiences:
        if not isinstance(exp, dict):
            continue
        achievements = exp.get("achievements")
        if isinstance(achievements, list):
            for item in achievements:
                if isinstance(item, dict):
                    text = item.get("rewritten") or item.get("original") or ""
                else:
                    text = str(item)
                text = text.strip()
                if text:
                    texts.append(text)
        elif isinstance(achievements, str):
            for line in achievements.split("\n"):
                line = line.strip()
                if line:
                    texts.append(line)

        # Fallback to description line if achievements are not available.
        description = exp.get("description")
        if isinstance(description, str) and description.strip():
            texts.append(description.strip())

    return texts


def _count_quantified_achievements(achievement_texts: List[str]) -> int:
    quantified_pattern = re.compile(r"(\d+%?|\$\d+|\d+[kKmM]|\d+\+)")
    return sum(1 for text in achievement_texts if quantified_pattern.search(text))


def _section_completeness_score(cv_data: Dict[str, Any]) -> float:
    present = 0
    for key in SECTION_KEYS:
        value = cv_data.get(key)
        if isinstance(value, list) and value:
            present += 1
        elif isinstance(value, str) and value.strip():
            present += 1
        elif value not in (None, "", [], {}):
            present += 1
    return (present / len(SECTION_KEYS)) * 100.0


def _vague_phrase_count(cv_data: Dict[str, Any], achievement_texts: List[str]) -> int:
    text_fragments: List[str] = []
    for key in ("summary", "title"):
        val = cv_data.get(key)
        if isinstance(val, str) and val.strip():
            text_fragments.append(val.lower())
    text_fragments.extend([t.lower() for t in achievement_texts])

    full_text = " ".join(text_fragments)
    return sum(full_text.count(phrase) for phrase in VAGUE_PHRASES)


def _clamp(value: float, minimum: float = 0.0, maximum: float = 100.0) -> float:
    return max(minimum, min(maximum, value))


def score_ats(jd_data: Dict[str, Any], cv_data: Dict[str, Any]) -> Dict[str, float]:
    """
    Score CV ATS quality against a JD.

    Rules implemented:
    - Keyword overlap % between JD skills and CV tools.
    - Count quantified achievements.
    - Check section completeness.
    - Penalize vague words/phrases (e.g., "responsible for", "assisted with").

    Returns:
    {
      "ats_score": number,
      "keyword_score": number,
      "impact_score": number
    }
    """
    jd_skills = _extract_jd_skills(jd_data)
    cv_tools = _extract_cv_tools(cv_data)

    if jd_skills:
        overlap = len(jd_skills & cv_tools)
        keyword_score = (overlap / len(jd_skills)) * 100.0
    else:
        keyword_score = 0.0

    achievement_texts = _collect_achievement_texts(cv_data)
    quantified_count = _count_quantified_achievements(achievement_texts)
    quantified_score = min(100.0, quantified_count * 12.5)  # 8+ quantified items => full points

    completeness_score = _section_completeness_score(cv_data)
    vague_count = _vague_phrase_count(cv_data, achievement_texts)
    vague_penalty = min(30.0, vague_count * 5.0)

    impact_score = (0.6 * quantified_score) + (0.4 * completeness_score) - vague_penalty
    impact_score = _clamp(impact_score)

    # Slightly favor direct keyword match while preserving writing quality signal.
    ats_score = _clamp((0.65 * keyword_score) + (0.35 * impact_score))

    result = ATSScoreResult(
        ats_score=round(ats_score, 2),
        keyword_score=round(keyword_score, 2),
        impact_score=round(impact_score, 2),
    )
    return result.model_dump()
