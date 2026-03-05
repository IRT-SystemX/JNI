from functools import lru_cache
from typing import Annotated

from fastapi import APIRouter, status, Depends
from fastapi.responses import ORJSONResponse

from config import Settings


@lru_cache
def get_settings():
    return Settings()


router = APIRouter()


@router.get("/status", response_class=ORJSONResponse)
def get_status():
    return ORJSONResponse(content={"message": "The Workflow Manager Api is up and running"},
                          status_code=status.HTTP_200_OK)


@router.get("/status/info")
async def get_status_info(settings: Annotated[Settings, Depends(get_settings)]):
    return ORJSONResponse(content={"app_name": settings.app_name, "admin_email": settings.admin_email},
                          status_code=status.HTTP_200_OK)
