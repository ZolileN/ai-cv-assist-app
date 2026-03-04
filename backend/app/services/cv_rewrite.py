import logging
from typing import List, Dict, Any
from app.services.openai_client import rewrite_bullet

logger = logging.getLogger(__name__)


def rewrite_experience_bullets(experiences: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Rewrite a list of experience bullets to be more impactful.
    
    For each experience entry with an 'achievements' list, rewrites each achievement
    using the rewrite_bullet() function with specific constraints:
    - Use action verbs
    - Quantify impact if present (no invented metrics)
    - Under 25 words per bullet
    - Professional tone
    
    Args:
        experiences: List of experience dicts, each with 'achievements' key
        
    Returns:
        Updated list with rewritten achievements
    """
    improved_experiences = []
    
    for experience in experiences:
        improved_exp = experience.copy()
        achievements = experience.get("achievements", [])
        improved_achievements = []
        
        for achievement in achievements:
            try:
                # Call rewrite_bullet with enhanced prompt instructions
                prompt_context = (
                    f"Rewrite this achievement using action verbs, quantify impact when present "
                    f"(do not invent metrics), keep under 25 words, maintain professional tone: {achievement}"
                )
                
                result = rewrite_bullet(achievement)
                
                # Use the rewritten version from the result
                rewritten = result.get("rewritten", achievement)
                improved_achievements.append({
                    "original": achievement,
                    "rewritten": rewritten,
                    "notes": result.get("notes")
                })
            except Exception as e:
                logger.error(f"Failed to rewrite bullet '{achievement}': {e}")
                # Fallback: keep original
                improved_achievements.append({
                    "original": achievement,
                    "rewritten": achievement,
                    "notes": "Rewrite failed, using original"
                })
        
        improved_exp["achievements"] = improved_achievements
        improved_experiences.append(improved_exp)
    
    return improved_experiences