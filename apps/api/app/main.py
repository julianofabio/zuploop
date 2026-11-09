# Ponto de entrada da API (FDD 001 §8.3). Valida a configuração ao iniciar: faltou variável,
# o processo para com uma mensagem que diz qual.
import sys
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import async_sessionmaker

from app.db import create_engine
from app.errors import install_error_handlers
from app.logging import configure_logging
from app.middleware import RequestContextMiddleware
from app.routes import health
from app.settings import Settings, SettingsError, load_settings


def create_app(*, settings: Settings) -> FastAPI:
    configure_logging(level=settings.api_log_level)
    engine = create_engine(settings=settings)

    @asynccontextmanager
    async def lifespan(_app: FastAPI) -> AsyncIterator[None]:
        yield
        await engine.dispose()

    app = FastAPI(
        lifespan=lifespan,
        title="ZupLoop API",
        version=settings.app_version,
        docs_url=None,
        redoc_url=None,
        openapi_url=None if settings.api_env == "production" else "/openapi.json",
    )
    app.state.settings = settings
    app.state.engine = engine
    app.state.session_factory = async_sessionmaker(engine, expire_on_commit=False)
    install_error_handlers(app)
    app.include_router(health.router)
    # A ordem importa: o último acrescentado fica por fora. O CORS envolve tudo, para os
    # cabeçalhos valerem também nas respostas de erro.
    app.add_middleware(RequestContextMiddleware)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.api_cors_origins,
        allow_credentials=False,
        allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allow_headers=["Content-Type", "X-Request-ID"],
        expose_headers=["X-Request-ID"],
        max_age=600,
    )
    return app


try:
    app = create_app(settings=load_settings())
except SettingsError as error:
    sys.stderr.write(f"{error}\n")
    raise SystemExit(1) from None
