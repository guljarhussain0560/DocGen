"""Async SQLAlchemy database setup."""

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from app.core.config import settings


class Base(DeclarativeBase):
    pass


engine = create_async_engine(
    settings.DATABASE_URL,
    echo=False,  # Disabled to prevent Windows charmap encoding crashes with Unicode log content
    future=True,
    pool_size=20,
    max_overflow=10,
    pool_timeout=30,
    pool_recycle=1800,
    pool_pre_ping=True,
)

AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


async def init_db():
    """Create all tables on startup and run migrations if needed."""
    from sqlalchemy import text
    async with engine.begin() as conn:
        from app.models import documentation, project  # noqa: import triggers model registration
        await conn.run_sync(Base.metadata.create_all)
        
        # Add new columns to projects table if they don't exist
        for col_name, col_type in [
            ("status", "VARCHAR(50) DEFAULT 'idle'"),
            ("progress", "INTEGER DEFAULT 0"),
            ("agent_phase", "VARCHAR(100) DEFAULT ''"),
            ("agent_log", "TEXT DEFAULT ''"),
            ("current_file", "VARCHAR(500) DEFAULT NULL")
        ]:
            try:
                # Check if column exists
                await conn.execute(text(f"SELECT {col_name} FROM projects LIMIT 1"))
            except Exception:
                try:
                    await conn.execute(text(f"ALTER TABLE projects ADD COLUMN {col_name} {col_type}"))
                except Exception as e:
                    print(f"Error migrating column {col_name}: {e}")
        



async def get_db():
    """Dependency: yields an async DB session."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
