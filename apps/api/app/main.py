# Ponto de entrada da API. Valida a configuração ao iniciar: faltou variável, o processo para.
import sys

from fastapi import FastAPI

from app.logging import configure_logging
from app.settings import Settings, SettingsError, load_settings


def create_app(*, settings: Settings) -> FastAPI:
    configure_logging(level=settings.api_log_level)
    return FastAPI(title="ZupLoop API", version=settings.app_version, docs_url=None, redoc_url=None)


try:
    app = create_app(settings=load_settings())
except SettingsError as error:
    sys.stderr.write(f"{error}\n")
    raise SystemExit(1) from None
