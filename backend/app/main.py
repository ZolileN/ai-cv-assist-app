"""
Main FastAPI application with all configurations and routes.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.core.database import (
    Base,
    engine,
    ensure_candidate_embedding_schema,
    ensure_pgvector_extension,
    is_pgvector_available,
)
from app.core.logger import logger
from app.routes import auth, candidates, jd_analyzer, matching, recruiters

# Initialize pgvector and create database tables
ensure_pgvector_extension()
try:
    Base.metadata.create_all(bind=engine)
except Exception as exc:
    # Allow app startup when pgvector is missing on PostgreSQL host.
    if is_pgvector_available():
        raise
    logger.warning(
        "Database auto-create partially skipped because pgvector is unavailable: %s",
        exc,
    )
ensure_candidate_embedding_schema()

# Initialize FastAPI app
app = FastAPI(
    title=settings.app_name,
    version=settings.version,
    description="Full-stack application for connecting candidates with recruiters",
    debug=settings.debug,
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1)(:\d+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Health check middleware
@app.middleware("http")
async def add_process_time_header(request, call_next):
    import time
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response


# Include routers
app.include_router(auth.router)
app.include_router(candidates.router)
app.include_router(recruiters.router)
app.include_router(jd_analyzer.router)
app.include_router(matching.router)


# Root endpoints
@app.get("/")
def read_root():
    """Root endpoint - application info"""
    return {
        "message": f"Welcome to {settings.app_name}",
        "version": settings.version,
        "docs": "/docs",
        "openapi": "/openapi.json",
    }


@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {
        "status": "ok",
        "service": settings.app_name,
        "debug": settings.debug,
    }


@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler"""
    logger.error(f"Unhandled exception: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"},
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.debug,
    )
