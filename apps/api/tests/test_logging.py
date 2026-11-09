# Logs em JSON com requestId (T033, FDD 001 §8.3); nunca a senha.
import io
import json
import logging

import pytest

from app.logging import configure_logging, request_id_var
from app.settings import load_settings

SECRET = "senha-secreta-que-nao-pode-vazar"


def capture(level: str = "info") -> tuple[logging.Logger, io.StringIO]:
    stream = io.StringIO()
    configure_logging(level=level, stream=stream)
    return logging.getLogger("zuploop.test"), stream


def test_log_sai_em_json_com_nivel_mensagem_e_request_id() -> None:
    logger, stream = capture()
    token = request_id_var.set("req-123")
    try:
        logger.info("request finished", extra={"route": "/health", "status": 200})
    finally:
        request_id_var.reset(token)
    record = json.loads(stream.getvalue().strip().splitlines()[-1])
    assert record["level"] == "info"
    assert record["message"] == "request finished"
    assert record["requestId"] == "req-123"
    assert record["route"] == "/health"
    assert record["status"] == 200
    assert "time" in record


def test_sem_pedido_o_request_id_fica_vazio() -> None:
    logger, stream = capture()
    logger.warning("startup")
    record = json.loads(stream.getvalue().strip().splitlines()[-1])
    assert record["requestId"] is None


def test_respeita_o_nivel_configurado() -> None:
    logger, stream = capture(level="warning")
    logger.info("hidden")
    assert stream.getvalue() == ""


def test_log_das_configuracoes_nunca_mostra_a_senha(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("POSTGRES_PASSWORD", SECRET)
    logger, stream = capture()
    settings = load_settings()
    logger.info("settings loaded", extra={"settings": settings.model_dump()})
    logger.info("settings %s", settings)
    assert SECRET not in stream.getvalue()
