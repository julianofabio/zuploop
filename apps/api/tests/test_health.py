# Rotas de saúde (T035, FDD 001 §6.7): /health, /ready e /version.
# /ready com banco precisa do PostgreSQL de teste (docker compose up -d db, ou o serviço do CI).
import time
from collections.abc import AsyncIterator

import httpx
import pytest

from app.main import create_app
from app.settings import load_settings


async def make_client() -> httpx.AsyncClient:
    app = create_app(settings=load_settings())
    transport = httpx.ASGITransport(app=app, raise_app_exceptions=False)
    return httpx.AsyncClient(transport=transport, base_url="http://test")


@pytest.fixture
async def client() -> AsyncIterator[httpx.AsyncClient]:
    async with await make_client() as http:
        yield http


async def test_health_responde_ok(client: httpx.AsyncClient) -> None:
    response = await client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


async def test_version_devolve_app_version_e_commit(client: httpx.AsyncClient) -> None:
    response = await client.get("/version")
    assert response.status_code == 200
    assert response.json() == {"version": "2026.11.08-abc1234", "commit": "abc1234"}


async def test_version_local_sem_commit(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("APP_VERSION", "local")
    async with await make_client() as http:
        response = await http.get("/version")
    assert response.json() == {"version": "local", "commit": "local"}


async def test_ready_responde_200_com_o_banco_de_pe(client: httpx.AsyncClient) -> None:
    response = await client.get("/ready")
    assert response.status_code == 200, response.text
    assert response.json() == {"status": "ready"}


async def test_ready_responde_503_sem_banco_em_ate_2_segundos(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    # Porta fechada: o banco não responde.
    monkeypatch.setenv("DB_HOST", "127.0.0.1")
    monkeypatch.setenv("DB_PORT", "1")
    async with await make_client() as http:
        started = time.perf_counter()
        response = await http.get("/ready")
        elapsed = time.perf_counter() - started
    assert response.status_code == 503
    assert response.json()["code"] == "database_unavailable"
    assert elapsed < 2.5


async def test_health_continua_200_sem_banco(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("DB_HOST", "127.0.0.1")
    monkeypatch.setenv("DB_PORT", "1")
    async with await make_client() as http:
        response = await http.get("/health")
    assert response.status_code == 200
