# Banco (FDD 001 §8.3): SQLAlchemy 2.0 assíncrono com asyncpg, um engine por processo e uma
# sessão por pedido.
from collections.abc import AsyncIterator

from fastapi import Request
from sqlalchemy import text
from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

from app.settings import Settings

# Tempo máximo para o banco responder no /ready (FDD 001 §6.7).
READY_TIMEOUT_SECONDS = 2.0


def create_engine(*, settings: Settings) -> AsyncEngine:
    return create_async_engine(
        settings.database_url(),
        pool_pre_ping=True,
        pool_size=5,
        max_overflow=5,
        # Conexão que não abre em 2 s conta como banco fora do ar.
        connect_args={"timeout": READY_TIMEOUT_SECONDS},
    )


async def ping(*, engine: AsyncEngine) -> None:
    """Lança erro se o banco não responder a SELECT 1."""
    async with engine.connect() as connection:
        await connection.execute(text("SELECT 1"))


async def get_session(request: Request) -> AsyncIterator[AsyncSession]:
    factory: async_sessionmaker[AsyncSession] = request.app.state.session_factory
    async with factory() as session:
        yield session
