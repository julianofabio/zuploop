# Ambiente dos testes da API: valores falsos, nunca dados reais (AGENTS.md).
import os

import pytest

TEST_ENV = {
    "POSTGRES_USER": "zuploop",
    "POSTGRES_PASSWORD": "senha-falsa-de-teste",
    "POSTGRES_DB": "zuploop_test",
    "DB_HOST": os.environ.get("DB_HOST", "127.0.0.1"),
    "DB_PORT": os.environ.get("DB_PORT", "5432"),
    "API_ENV": "test",
    "API_LOG_LEVEL": "info",
    "API_CORS_ORIGINS": "http://localhost:8080",
    "APP_VERSION": "2026.11.08-abc1234",
}

# O app.main cria a app ao ser importado; o ambiente precisa existir já na coleta dos testes.
for _key, _value in TEST_ENV.items():
    os.environ.setdefault(_key, os.environ.get(f"TEST_{_key}", _value))


@pytest.fixture(autouse=True)
def test_env(monkeypatch: pytest.MonkeyPatch) -> dict[str, str]:
    for key, value in TEST_ENV.items():
        monkeypatch.setenv(key, os.environ.get(f"TEST_{key}", value))
    return dict(TEST_ENV)
