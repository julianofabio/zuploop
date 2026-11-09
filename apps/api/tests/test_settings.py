# Configurações (T033, FDD 001 §6.8): faltou variável, o processo para e diz qual.
import os
import subprocess
import sys
from pathlib import Path

import pytest

from app.settings import Settings, SettingsError, load_settings

API_DIR = Path(__file__).resolve().parents[1]
SECRET = "senha-secreta-que-nao-pode-vazar"


def test_monta_a_url_do_banco_a_partir_das_variaveis(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("POSTGRES_USER", "zuploop")
    monkeypatch.setenv("POSTGRES_PASSWORD", "p@ss/word")
    monkeypatch.setenv("POSTGRES_DB", "zuploop_test")
    monkeypatch.setenv("DB_HOST", "db")
    monkeypatch.setenv("DB_PORT", "5432")
    url = load_settings().database_url()
    assert url == "postgresql+asyncpg://zuploop:p%40ss%2Fword@db:5432/zuploop_test"


def test_le_as_origens_de_cors_separadas_por_virgula(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("API_CORS_ORIGINS", "http://localhost:8080, https://zuploop.com")
    assert load_settings().api_cors_origins == ["http://localhost:8080", "https://zuploop.com"]


def test_variavel_obrigatoria_faltando_diz_qual(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.delenv("POSTGRES_PASSWORD")
    with pytest.raises(SettingsError) as error:
        load_settings()
    assert "POSTGRES_PASSWORD" in str(error.value)


def test_erro_de_configuracao_nunca_mostra_o_valor_da_senha(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    monkeypatch.setenv("POSTGRES_PASSWORD", SECRET)
    monkeypatch.setenv("DB_PORT", "nao-e-numero")
    with pytest.raises(SettingsError) as error:
        load_settings()
    assert "DB_PORT" in str(error.value)
    assert SECRET not in str(error.value)


def test_repr_das_configuracoes_esconde_a_senha(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("POSTGRES_PASSWORD", SECRET)
    settings = load_settings()
    assert SECRET not in repr(settings)
    assert SECRET not in str(settings.model_dump())
    assert isinstance(settings, Settings)


def test_processo_para_quando_falta_variavel_e_diz_qual() -> None:
    env = {k: v for k, v in os.environ.items() if not k.startswith(("POSTGRES_", "DB_", "API_"))}
    env.update({"POSTGRES_USER": "zuploop", "POSTGRES_DB": "zuploop"})
    result = subprocess.run(
        [sys.executable, "-c", "import app.main"],
        cwd=API_DIR,
        env=env,
        capture_output=True,
        text=True,
        timeout=60,
        check=False,
    )
    assert result.returncode != 0
    assert "POSTGRES_PASSWORD" in result.stderr
    assert "Traceback" not in result.stderr
