# Configuração da API, só por variáveis de ambiente (ADR-0009, FDD 001 §6.8).
# Faltou uma obrigatória: o processo para com uma mensagem que diz qual, sem nunca mostrar valores.
from typing import Annotated, Literal
from urllib.parse import quote

from pydantic import Field, SecretStr, ValidationError, field_validator
from pydantic_settings import BaseSettings, NoDecode, SettingsConfigDict

Environment = Literal["local", "test", "staging", "production"]
LogLevel = Literal["debug", "info", "warning", "error"]


class SettingsError(RuntimeError):
    pass


class Settings(BaseSettings):
    model_config = SettingsConfigDict(case_sensitive=False, extra="ignore", frozen=True)

    postgres_user: str
    postgres_password: SecretStr
    postgres_db: str
    db_host: str = "localhost"
    db_port: int = Field(default=5_432, ge=1, le=65_535)

    api_env: Environment = "local"
    api_log_level: LogLevel = "info"
    # Origens separadas por vírgula; NoDecode evita a leitura como JSON.
    api_cors_origins: Annotated[list[str], NoDecode] = Field(default_factory=list)
    app_version: str = "local"

    @field_validator("api_cors_origins", mode="before")
    @classmethod
    def split_origins(cls, value: object) -> object:
        if isinstance(value, str):
            return [origin.strip() for origin in value.split(",") if origin.strip()]
        return value

    def database_url(self) -> str:
        user = quote(self.postgres_user, safe="")
        password = quote(self.postgres_password.get_secret_value(), safe="")
        return (
            f"postgresql+asyncpg://{user}:{password}@{self.db_host}:{self.db_port}/"
            f"{quote(self.postgres_db, safe='')}"
        )


def load_settings() -> Settings:
    try:
        return Settings()
    except ValidationError as error:
        # Só nomes de variáveis e o tipo do problema; nunca o valor recebido.
        problems = [
            f"{'.'.join(str(part) for part in issue['loc']).upper()}: {issue['msg']}"
            for issue in error.errors(include_input=False, include_url=False)
        ]
        raise SettingsError("Invalid configuration. " + "; ".join(problems)) from None
