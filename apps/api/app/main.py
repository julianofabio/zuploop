# Ponto de entrada da API (FDD 001 §8.3). Valida a configuração ao iniciar: faltou variável,
# o processo para com uma mensagem que diz qual.
import sys

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.errors import install_error_handlers
from app.logging import configure_logging
from app.middleware import RequestContextMiddleware
from app.settings import Settings, SettingsError, load_settings


def create_app(*, settings: Settings) -> FastAPI:
    configure_logging(level=settings.api_log_level)
    app = FastAPI(
        title="ZupLoop API",
        version=settings.app_version,
        docs_url=None,
        redoc_url=None,
        openapi_url=None if settings.api_env == "production" else "/openapi.json",
    )
    install_error_handlers(app)
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
