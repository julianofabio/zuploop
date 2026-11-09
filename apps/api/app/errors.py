# Erros da API em Problem Details (RFC 9457, ADR-0016). Este é o catálogo único de códigos:
# o cliente lê o `code` (estável) e mostra a mensagem traduzida; `title` e `detail` são em inglês.
import logging
from enum import StrEnum
from typing import Any

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.logging import request_id_var

PROBLEM_JSON = "application/problem+json"
ERROR_TYPE_BASE = "https://zuploop.com/errors/"

logger = logging.getLogger("zuploop.errors")


class ErrorCode(StrEnum):
    INTERNAL_ERROR = "internal_error"
    NOT_FOUND = "not_found"
    METHOD_NOT_ALLOWED = "method_not_allowed"
    VALIDATION_ERROR = "validation_error"
    DATABASE_UNAVAILABLE = "database_unavailable"


# Código → (status HTTP, título, detalhe padrão). Detalhes nunca trazem dados internos.
CATALOG: dict[ErrorCode, tuple[int, str, str]] = {
    ErrorCode.INTERNAL_ERROR: (500, "Internal error", "Something went wrong on our side."),
    ErrorCode.NOT_FOUND: (404, "Not found", "The requested resource does not exist."),
    ErrorCode.METHOD_NOT_ALLOWED: (
        405,
        "Method not allowed",
        "This method is not allowed for this resource.",
    ),
    ErrorCode.VALIDATION_ERROR: (422, "Validation error", "The request has invalid fields."),
    ErrorCode.DATABASE_UNAVAILABLE: (
        503,
        "Database unavailable",
        "The database did not answer in time.",
    ),
}


class ApiError(Exception):
    def __init__(self, *, code: ErrorCode, detail: str | None = None) -> None:
        super().__init__(code.value)
        self.code = code
        self.detail = detail


def problem_response(
    *,
    code: ErrorCode,
    instance: str,
    detail: str | None = None,
    extra: dict[str, Any] | None = None,
) -> JSONResponse:
    status, title, default_detail = CATALOG[code]
    body: dict[str, Any] = {
        "type": f"{ERROR_TYPE_BASE}{code.value}",
        "title": title,
        "status": status,
        "detail": detail or default_detail,
        "code": code.value,
        "instance": instance,
        "requestId": request_id_var.get(),
        **(extra or {}),
    }
    return JSONResponse(body, status_code=status, media_type=PROBLEM_JSON)


def internal_error_response(*, instance: str) -> JSONResponse:
    return problem_response(code=ErrorCode.INTERNAL_ERROR, instance=instance)


async def _api_error(request: Request, exc: Exception) -> JSONResponse:
    if not isinstance(exc, ApiError):
        return internal_error_response(instance=request.url.path)
    return problem_response(code=exc.code, instance=request.url.path, detail=exc.detail)


async def _http_error(request: Request, exc: Exception) -> JSONResponse:
    if not isinstance(exc, StarletteHTTPException):
        return internal_error_response(instance=request.url.path)
    code = {
        404: ErrorCode.NOT_FOUND,
        405: ErrorCode.METHOD_NOT_ALLOWED,
    }.get(exc.status_code, ErrorCode.INTERNAL_ERROR)
    response = problem_response(code=code, instance=request.url.path)
    if exc.headers:
        response.headers.update(exc.headers)
    return response


async def _validation_error(request: Request, exc: Exception) -> JSONResponse:
    if not isinstance(exc, RequestValidationError):
        return internal_error_response(instance=request.url.path)
    # Só o campo e o tipo do problema; nunca o valor enviado.
    errors = [
        {"field": ".".join(str(part) for part in issue["loc"][1:]), "code": issue["type"]}
        for issue in exc.errors()
    ]
    return problem_response(
        code=ErrorCode.VALIDATION_ERROR,
        instance=request.url.path,
        extra={"errors": errors},
    )


def install_error_handlers(app: FastAPI) -> None:
    app.add_exception_handler(ApiError, _api_error)
    app.add_exception_handler(StarletteHTTPException, _http_error)
    app.add_exception_handler(RequestValidationError, _validation_error)
