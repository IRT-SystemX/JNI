from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "JNI1.WorkflowManager.Api"
    admin_email: str = "ADMIN_EMAIL IS NOT SETUP IN ENV"
    db_name: str
    base_host: str
    base_port: int
    base_url: str
    db_url: str
    environment: str = "dev"
    allowed_origins: str = "http://localhost,http://localhost:3000,http://localhost:8081,http://jni1.irtsysx.fr:8085"

    model_config = SettingsConfigDict(env_file=".env")

    @property
    def origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.allowed_origins.split(',')]