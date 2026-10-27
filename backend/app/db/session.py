from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy import event
from sqlalchemy.exc import InterfaceError, OperationalError
from app.core.config import settings

# Create async engine
engine: AsyncEngine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.APP_ENV == "development",
    future=True,
)

# Create session factory
SessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    autoflush=False,
    autocommit=False,
    future=True,
)


async def get_db() -> AsyncSession:
    """Dependency that yields a database session."""
    async with SessionLocal() as session:
        try:
            yield session
            await session.commit()
        except (InterfaceError, OperationalError) as exc:
            await session.rollback()
            raise HTTPException(
                status_code=503,
                detail=(
                    "Database connection failed. Check DATABASE_URL in backend/.env "
                    "and verify that PostgreSQL is accepting the configured credentials."
                ),
            ) from exc
        except Exception:
            await session.rollback()
            raise


# Health check
async def db_health() -> bool:
    """Simple DB liveness probe."""
    try:
        async with SessionLocal() as session:
            await session.execute("SELECT 1")
        return True
    except Exception:
        return False