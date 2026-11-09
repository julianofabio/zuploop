# Erros em Problem Details, X-Request-ID e CORS (T034, ADR-0016, FDD 001 §6.7).
import json
import logging
from collections.abc import AsyncIterator

import httpx
import pytest
from fastapi import FastAPI
from pydantic import BaseModel

from app.main import create_app
from app.settings import load_settings

PROBLEM_JSON = "application/problem+json"


class Payload(BaseModel):
    name: str
    age: int


def build_app() -> FastAPI:
    app = create_app(settings=load_settings())

    async def boom() -> None:
        raise RuntimeError("segredo interno: tabela users")

    async def echo(payload: Payload) -> Payload:
        return payload

    app.add_api_route("/test/boom", boom, methods=["GET"])
    app.add_api_route("/test/echo", echo, methods=["POST"])
    return app


@pytest.fixture
async def client() -> AsyncIterator[httpx.AsyncClient]:
    transport = httpx.ASGITransport(app=build_app(), raise_app_exceptions=False)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as http:
        yield http


async def test_erro_inesperado_vira_500_internal_error_sem_detalhes(
    client: httpx.AsyncClient,
) -> None:
    response = await client.get("/test/boom")
    assert response.status_code == 500
    assert response.headers["content-type"].startswith(PROBLEM_JSON)
    body = response.json()
    assert body["code"] == "internal_error"
    assert body["status"] == 500
    assert body["type"] == "https://zuploop.com/errors/internal_error"
    assert body["instance"] == "/test/boom"
    assert body["requestId"] == response.headers["x-request-id"]
    assert "segredo" not in response.text
    assert "RuntimeError" not in response.text


async def test_erro_inesperado_vai_para_o_log_com_o_request_id(
    client: httpx.AsyncClient,
    caplog: pytest.LogCaptureFixture,
) -> None:
    with caplog.at_level(logging.ERROR):
        response = await client.get("/test/boom", headers={"X-Request-ID": "req-erro-1"})
    assert response.status_code == 500
    errors = [record for record in caplog.records if record.levelno >= logging.ERROR]
    assert errors
    assert "segredo interno" in (errors[0].exc_text or str(errors[0].exc_info))


async def test_x_request_id_recebido_e_devolvido(client: httpx.AsyncClient) -> None:
    response = await client.get("/nao-existe", headers={"X-Request-ID": "abc-123"})
    assert response.headers["x-request-id"] == "abc-123"
    assert response.json()["requestId"] == "abc-123"


async def test_sem_x_request_id_um_novo_e_criado(client: httpx.AsyncClient) -> None:
    first = await client.get("/nao-existe")
    second = await client.get("/nao-existe")
    assert first.headers["x-request-id"]
    assert first.headers["x-request-id"] != second.headers["x-request-id"]


async def test_x_request_id_invalido_e_trocado_por_um_novo(client: httpx.AsyncClient) -> None:
    response = await client.get("/nao-existe", headers={"X-Request-ID": "a" * 300})
    assert response.headers["x-request-id"] != "a" * 300
    assert len(response.headers["x-request-id"]) <= 128


async def test_rota_inexistente_vira_problem_not_found(client: httpx.AsyncClient) -> None:
    response = await client.get("/nao-existe")
    assert response.status_code == 404
    assert response.headers["content-type"].startswith(PROBLEM_JSON)
    assert response.json()["code"] == "not_found"


async def test_metodo_errado_vira_problem_method_not_allowed(client: httpx.AsyncClient) -> None:
    response = await client.delete("/test/boom")
    assert response.status_code == 405
    assert response.json()["code"] == "method_not_allowed"


async def test_validacao_vira_422_com_campos_e_codigos(client: httpx.AsyncClient) -> None:
    response = await client.post("/test/echo", json={"name": "Ana", "age": "muitos"})
    assert response.status_code == 422
    body = response.json()
    assert body["code"] == "validation_error"
    assert body["errors"] == [{"field": "age", "code": "int_parsing"}]
    assert "muitos" not in json.dumps(body)


async def test_cors_libera_origem_da_lista(client: httpx.AsyncClient) -> None:
    response = await client.get("/nao-existe", headers={"Origin": "http://localhost:8080"})
    assert response.headers["access-control-allow-origin"] == "http://localhost:8080"


async def test_cors_nao_libera_origem_fora_da_lista(client: httpx.AsyncClient) -> None:
    response = await client.get("/nao-existe", headers={"Origin": "https://malicioso.example"})
    assert "access-control-allow-origin" not in response.headers


async def test_preflight_de_origem_fora_da_lista_nao_recebe_cabecalhos(
    client: httpx.AsyncClient,
) -> None:
    response = await client.options(
        "/test/echo",
        headers={"Origin": "https://malicioso.example", "Access-Control-Request-Method": "POST"},
    )
    assert "access-control-allow-origin" not in response.headers
