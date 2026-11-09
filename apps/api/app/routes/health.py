# Rotas de saúde (FDD 001 §6.7): liveness, readiness e versão publicada.
import asyncio
import logging

from fastapi import APIRouter, Request
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncEngine

from app.db import READY_TIMEOUT_SECONDS, ping
from app.errors import ApiError, ErrorCode
from app.settings import Settings

router = APIRouter(tags=["health"])
logger = logging.getLogger("zuploop.health")


class HealthResponse(BaseModel):
    status: str


class VersionResponse(BaseModel):
    version: str
    commit: str


@router.get("/health")
async def health() -> HealthResponse:
    # Só diz que o processo está de pé; não olha o banco.
    return HealthResponse(status="ok")


@router.get("/ready")
async def ready(request: Request) -> HealthResponse:
    engine: AsyncEngine = request.app.state.engine
    try:
        async with asyncio.timeout(READY_TIMEOUT_SECONDS):
            await ping(engine=engine)
    except Exception as error:
        logger.warning("database not ready", extra={"reason": type(error).__name__})
        raise ApiError(code=ErrorCode.DATABASE_UNAVAILABLE) from None
    return HealthResponse(status="ready")


@router.get("/version")
async def version(request: Request) -> VersionResponse:
    settings: Settings = request.app.state.settings
    # Versão no formato AAAA.MM.DD-<commit> (roteiro de publicação); "local" no desenvolvimento.
    commit = settings.app_version.rsplit("-", 1)[-1]
    return VersionResponse(version=settings.app_version, commit=commit)
