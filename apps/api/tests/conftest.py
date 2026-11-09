# Ambiente dos testes da API: valores falsos, nunca dados reais (AGENTS.md).
import os

import pytest

# Padrões iguais aos do .env.example (o banco do docker compose); o CI define os próprios.
_DEFAULTS = {
    "POSTGRES_USER": "zuploop",
    "POSTGRES_PASSWORD": "troque-esta-senha",
    "POSTGRES_DB": "zuploop",
    "DB_HOST": "127.0.0.1",
    "DB_PORT": "5432",
}
TEST_ENV = {
    **{key: os.environ.get(key, value) for key, value in _DEFAULTS.items()},
    "API_ENV": "test",
    "API_LOG_LEVEL": "info",
    "API_CORS_ORIGINS": "http://localhost:8080",
    "APP_VERSION": "2026.11.08-abc1234",
}

# O app.main cria a app ao ser importado; o ambiente precisa existir já na coleta dos testes.
for _key, _value in TEST_ENV.items():
    os.environ.setdefault(_key, _value)


@pytest.fixture(autouse=True)
def test_env(monkeypatch: pytest.MonkeyPatch) -> dict[str, str]:
    for key, value in TEST_ENV.items():
        monkeypatch.setenv(key, value)
    return dict(TEST_ENV)
