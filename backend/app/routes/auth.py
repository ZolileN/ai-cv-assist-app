from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import HTMLResponse, JSONResponse
from sqlalchemy.orm import Session
from datetime import timedelta

from app.core.database import get_db
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
)
from app.core.config import settings
from app.models import User
from app.schemas import UserCreate, UserLogin, UserResponse, TokenResponse

router = APIRouter(prefix="/api/auth", tags=["auth"])

# informational/get‑form endpoints
@router.get("/register", response_class=JSONResponse)
def get_register_info():
    """
    GET /api/auth/register – just tells the caller how to use the POST
    endpoint (or could render an HTML form).
    """
    return {"detail": "POST to this URL with {email,password,full_name} "
                      "to create an account."}

@router.get("/login", response_class=JSONResponse)
def get_login_info():
    return {"detail": "POST to this URL with {email,password} to log in."}

# alternatively, return HTML:
# @router.get("/register", response_class=HTMLResponse)
# def get_register_form():
#     return """
#     <html><body>
#       <form action="/api/auth/register" method="post">
#         Email: <input name="email"><br>
#         Password: <input name="password" type="password"><br>
#         Full name: <input name="full_name"><br>
#         <button type="submit">Register</button>
#       </form>
#     </body></html>
#     """

# existing POST handlers stay unchanged

@router.post("/register", response_model=TokenResponse)
def register(user_create: UserCreate, db: Session = Depends(get_db)):
    """Register a new user"""
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_create.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    # Create new user
    hashed_password = hash_password(user_create.password)
    user = User(
        email=user_create.email,
        hashed_password=hashed_password,
        full_name=user_create.full_name,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Create access token
    access_token = create_access_token(data={"sub": user.id})

    return TokenResponse(
        access_token=access_token,
        user=UserResponse.model_validate(user),
    )


@router.post("/login", response_model=TokenResponse)
def login(user_login: UserLogin, db: Session = Depends(get_db)):
    """Login user"""
    user = db.query(User).filter(User.email == user_login.email).first()

    if not user or not verify_password(user_login.password, str(user.hashed_password)):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    # Create access token
    access_token = create_access_token(data={"sub": user.id})

    return TokenResponse(
        access_token=access_token,
        user=UserResponse.model_validate(user),
    )


@router.get("/me", response_model=UserResponse)
def get_current_user_info(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get current user info"""
    user = db.query(User).filter(User.id == current_user["user_id"]).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    return user
