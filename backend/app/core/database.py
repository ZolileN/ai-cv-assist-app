import logging

from sqlalchemy import create_engine, text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import DeclarativeBase, sessionmaker
from app.core.config import settings

logger = logging.getLogger(__name__)

engine = create_engine(
    settings.database_url,
    echo=settings.debug,
    pool_pre_ping=True,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


_pgvector_available = False


def _is_postgres() -> bool:
    return settings.database_url.startswith("postgresql")


def ensure_pgvector_extension() -> bool:
    """Enable pgvector extension for PostgreSQL databases."""
    global _pgvector_available
    if not _is_postgres():
        _pgvector_available = False
        return False
    try:
        with engine.begin() as conn:
            conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
        _pgvector_available = True
    except SQLAlchemyError as exc:
        _pgvector_available = False
        logger.warning(
            "pgvector extension is unavailable; vector features disabled until installed on PostgreSQL. %s",
            exc,
        )
    return _pgvector_available


def is_pgvector_available() -> bool:
    return _pgvector_available


def ensure_candidate_embedding_schema() -> None:
    """
    Ensure existing databases have the candidate embedding column and index.
    Safe for repeated calls.
    """
    try:
        with engine.begin() as conn:
            # Keep schema compatible even when pgvector is unavailable.
            # Without this, ORM SELECTs that include candidates.embedding fail.
            if _is_postgres():
                if _pgvector_available:
                    conn.execute(
                        text(
                            "ALTER TABLE IF EXISTS candidates "
                            "ADD COLUMN IF NOT EXISTS embedding vector(1536)"
                        )
                    )
                    conn.execute(
                        text(
                            "CREATE INDEX IF NOT EXISTS idx_candidates_embedding_cosine "
                            "ON candidates USING ivfflat (embedding vector_cosine_ops) "
                            "WITH (lists = 100)"
                        )
                    )
                else:
                    conn.execute(
                        text(
                            "ALTER TABLE IF EXISTS candidates "
                            "ADD COLUMN IF NOT EXISTS embedding TEXT"
                        )
                    )
    except SQLAlchemyError as exc:
        logger.warning("Failed to ensure candidate embedding schema: %s", exc)


def get_db():
    """Dependency for getting database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
