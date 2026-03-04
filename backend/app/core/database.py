from sqlalchemy import create_engine, text
from sqlalchemy.orm import DeclarativeBase, sessionmaker
from app.core.config import settings

engine = create_engine(
    settings.database_url,
    echo=settings.debug,
    pool_pre_ping=True,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def _is_postgres() -> bool:
    return settings.database_url.startswith("postgresql")


def ensure_pgvector_extension() -> None:
    """Enable pgvector extension for PostgreSQL databases."""
    if not _is_postgres():
        return
    with engine.begin() as conn:
        conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))


def ensure_candidate_embedding_schema() -> None:
    """
    Ensure existing databases have the candidate embedding column and index.
    Safe for repeated calls.
    """
    if not _is_postgres():
        return
    with engine.begin() as conn:
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


def get_db():
    """Dependency for getting database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
