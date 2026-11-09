# Middleware de cada pedido (FDD 001 §6.7 e §8.3): X-Request-ID, log em JSON com rota, status e
# duração, e erro inesperado convertido em 500 internal_error sem detalhes (o detalhe vai ao log).
import logging
import re
import time
import uuid

from starlette.types import ASGIApp, Message, Receive, Scope, Send

from app.errors import internal_error_response
from app.logging import request_id_var

REQUEST_ID_HEADER = b"x-request-id"
# Aceita só identificadores simples, para nada estranho chegar ao log.
_VALID_REQUEST_ID = re.compile(r"^[A-Za-z0-9._:-]{1,128}$")

logger = logging.getLogger("zuploop.request")


def _incoming_request_id(scope: Scope) -> str | None:
    for name, value in scope.get("headers", []):
        if name == REQUEST_ID_HEADER:
            candidate = value.decode("latin-1")
            return candidate if _VALID_REQUEST_ID.match(candidate) else None
    return None


class RequestContextMiddleware:
    def __init__(self, app: ASGIApp) -> None:
        self.app = app

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

        request_id = _incoming_request_id(scope) or uuid.uuid4().hex
        token = request_id_var.set(request_id)
        started = time.perf_counter()
        status = 500
        response_started = False

        async def send_with_id(message: Message) -> None:
            nonlocal status, response_started
            if message["type"] == "http.response.start":
                response_started = True
                status = message["status"]
                headers = [
                    (name, value)
                    for name, value in message.get("headers", [])
                    if name != REQUEST_ID_HEADER
                ]
                headers.append((REQUEST_ID_HEADER, request_id.encode("latin-1")))
                message["headers"] = headers
            await send(message)

        try:
            await self.app(scope, receive, send_with_id)
        except Exception:
            logger.exception("unhandled error", extra={"route": scope.get("path")})
            if response_started:
                raise
            await internal_error_response(instance=scope.get("path", ""))(
                scope, receive, send_with_id
            )
        finally:
            logger.info(
                "request finished",
                extra={
                    "method": scope.get("method"),
                    "route": scope.get("path"),
                    "status": status,
                    "durationMs": round((time.perf_counter() - started) * 1_000, 1),
                },
            )
            request_id_var.reset(token)
