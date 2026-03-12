import enum
from pathlib import Path
from tempfile import gettempdir
from typing import Optional # Adicionado o import que faltava

from pydantic_settings import BaseSettings, SettingsConfigDict
from yarl import URL

TEMP_DIR = Path(gettempdir())

class LogLevel(enum.StrEnum):
    NOTSET = "NOTSET"
    DEBUG = "DEBUG"
    INFO = "INFO"
    WARNING = "WARNING"
    ERROR = "ERROR"
    FATAL = "FATAL"

class Settings(BaseSettings):
    host: str = "127.0.0.1"
    port: int = 8000
    workers_count: int = 1
    reload: bool = False
    environment: str = "dev"
    log_level: LogLevel = LogLevel.INFO

    # Variáveis do Banco
    db_host: str = "localhost"
    db_port: int = 5432
    db_user: str = "code"
    db_pass: str = "code" 
    db_base: str = "admin"
    db_echo: bool = False
    frontend_url: str = "http://localhost:5173"
    database_url: Optional[str] = None 
    
    url_backend: str = "http://localhost:8080"
    gemini_api_key: str = ""
    secret_key: str = ""

    @property
    def db_url(self) -> URL:
        if self.database_url:
            url = URL(self.database_url)
            if not url.scheme.endswith("asyncpg"):
                url = url.with_scheme("postgresql+asyncpg")
            
            # Limpeza profunda da query string para o asyncpg
            original_query = dict(url.query)
            clean_query = {}
            
            # 1. Tratamento do SSL (Mudar sslmode para ssl)
            if "sslmode" in original_query:
                clean_query["ssl"] = original_query["sslmode"]
            elif "ssl" in original_query:
                clean_query["ssl"] = original_query["ssl"]
            else:
                clean_query["ssl"] = "require"

            for key in ["prepared_statement_cache_size", "statement_cache_size"]:
                if key in original_query:
                    clean_query[key] = original_query[key]

            return url.with_query(clean_query)

        # Caso use campos individuais
        return URL.build(
            scheme="postgresql+asyncpg",
            host=self.db_host,
            port=self.db_port,
            user=self.db_user,
            password=self.db_pass,
            path=f"/{self.db_base}",
            query={"ssl": "require"}
        )

    model_config = SettingsConfigDict(
        env_file=".env",
        env_prefix="CODE_",
        env_file_encoding="utf-8",
        extra="ignore"  # Ignora campos extras no .env sem travar o app
    )

settings = Settings()