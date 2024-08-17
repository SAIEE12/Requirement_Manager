from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    SECRET_KEY: str = "YOUR_SECRET_KEY"  # Change this!
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    DATABASE_URL: str = "sqlite:///./sql_app.db"
    FASTAPI_ENV: str = "development"

    model_config = SettingsConfigDict(env_file=".env", extra="allow")

settings = Settings()