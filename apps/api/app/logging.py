# Logs em JSON na saída padrão, com o requestId do pedido (FDD 001 §8.3).
# Nunca e-mail, token ou senha em log (AGENTS.md).
import json
import logging
import sys
from contextvars import ContextVar
from datetime import UTC, datetime
from typing import Any, TextIO

request_id_var: ContextVar[str | None] = ContextVar("request_id", default=None)

# Atributos que todo LogRecord tem; o resto veio de `extra=` e entra no JSON.
_STANDARD_ATTRIBUTES = set(vars(logging.makeLogRecord({}))) | {"message", "asctime"}


class JsonFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        payload: dict[str, Any] = {
            "time": datetime.fromtimestamp(record.created, tz=UTC).isoformat(),
            "level": record.levelname.lower(),
            "message": record.getMessage(),
            "logger": record.name,
            "requestId": request_id_var.get(),
        }
        for key, value in vars(record).items():
            if key not in _STANDARD_ATTRIBUTES and not key.startswith("_"):
                payload[key] = value
        if record.exc_info:
            payload["exception"] = self.formatException(record.exc_info)
        return json.dumps(payload, default=str, ensure_ascii=False)


def configure_logging(*, level: str, stream: TextIO = sys.stdout) -> None:
    handler = logging.StreamHandler(stream)
    handler.setFormatter(JsonFormatter())
    root = logging.getLogger()
    root.handlers[:] = [handler]
    root.setLevel(level.upper())
    # O Uvicorn tem logs próprios de acesso; os nossos já registram cada pedido.
    for name in ("uvicorn", "uvicorn.error", "uvicorn.access"):
        uvicorn_logger = logging.getLogger(name)
        uvicorn_logger.handlers[:] = []
        uvicorn_logger.propagate = True
    logging.getLogger("uvicorn.access").disabled = True
