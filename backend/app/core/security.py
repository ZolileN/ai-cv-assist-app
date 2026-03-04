from datetime import datetime, timedelta
from typing import Optional

import bcrypt
import hashlib
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.core.config import settings

# JWT
security = HTTPBearer()

def _prehash_password(password: str) -> bytes:
    """
    Pre-hash password so bcrypt input is fixed-size and avoids 72-byte limit.
    """
    return hashlib.sha256(password.encode("utf-8")).hexdigest().encode("utf-8")


def hash_password(password: str) -> str:
    """Hash a password using bcrypt over SHA-256 prehash."""
    hashed = bcrypt.hashpw(_prehash_password(password), bcrypt.gensalt())
    return hashed.decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a password against stored hash.
    Supports:
    - current scheme: bcrypt(SHA-256(password))
    - legacy scheme: raw bcrypt(password) for previously stored hashes
    """
    try:
        hash_bytes = hashed_password.encode("utf-8")
    except Exception:
        return False

    try:
        # First, verify against current scheme.
        if bcrypt.checkpw(_prehash_password(plain_password), hash_bytes):
            return True
    except Exception:
        pass

    # Backward compatibility: old hashes may be raw bcrypt(password).
    try:
        plain_bytes = plain_password.encode("utf-8")
        if len(plain_bytes) <= 72 and bcrypt.checkpw(plain_bytes, hash_bytes):
            return True
    except Exception:
        pass

    return False


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(
            minutes=settings.access_token_expire_minutes
        )
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode, settings.secret_key, algorithm=settings.algorithm
    )
    return encoded_jwt


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """Get current user from JWT token"""
    token = credentials.credentials
    try:
        payload = jwt.decode(
            token, settings.secret_key, algorithms=[settings.algorithm]
        )
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
            )
        try:
            user_id_int: int = int(user_id)
        except (TypeError, ValueError):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
            )
        return {"user_id": user_id_int}
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
        )
