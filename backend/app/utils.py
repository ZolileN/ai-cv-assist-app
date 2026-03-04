"""
Utility functions for the application.
"""
from typing import Optional


def get_pagination_params(skip: int = 0, limit: int = 10) -> tuple:
    """Get pagination parameters"""
    skip = max(0, skip)
    limit = min(100, max(1, limit))
    return skip, limit
