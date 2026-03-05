from typing import Annotated, List
from fastapi import APIRouter, Depends, status, HTTPException
from odmantic import ObjectId
from brokers.storage_broker import StorageBroker
from models.foundations.decision_system_archive_items.DecisionSystemArchiveItem import DecisionSystemArchiveItem, \
    DecisionSystemArchiveItemPatch
from services.foundations.decision_system_archive_item_service import DecisionSystemArchiveItemService
from services.foundations.decision_system_archive_item_service_interface import IDecisionSystemArchiveItemService

router = APIRouter()

from functools import lru_cache
import config


@lru_cache
def get_settings():
    return config.Settings()


def get_storage_broker(settings):
    return StorageBroker(db_url=settings.db_url, db_name=settings.db_name)


def init_decision_system_archive_item_service():
    settings = get_settings()
    storage_broker = get_storage_broker(settings)
    service = DecisionSystemArchiveItemService(broker=storage_broker)
    return service


IDecisionSystemArchiveItemServiceDep = Annotated[
    IDecisionSystemArchiveItemService, Depends(init_decision_system_archive_item_service)]


@router.post("/archive-items/", status_code=status.HTTP_201_CREATED, response_model=DecisionSystemArchiveItem)
async def create_archive_item(archive_item: DecisionSystemArchiveItem,
                              archive_service: IDecisionSystemArchiveItemServiceDep):
    inserted_archive_item = await archive_service.add_archive_item(archive_item=archive_item)
    return inserted_archive_item


@router.get("/archive-items/", response_model=List[DecisionSystemArchiveItem])
async def get_all_archive_items(archive_item_service: IDecisionSystemArchiveItemServiceDep):
    archive_items = await archive_item_service.retrieve_all_archive_items()
    return archive_items


@router.get("/archive-items/{id}", response_model=DecisionSystemArchiveItem)
async def get_archive_item(id: ObjectId, archive_item_service: IDecisionSystemArchiveItemServiceDep):
    archive_item = await archive_item_service.retrieve_archive_item_by_id(id=id)
    if not archive_item:
        raise HTTPException(status_code=404, detail="Archive item not found")
    return archive_item


@router.patch("/archive-items/{id}", response_model=DecisionSystemArchiveItem)
async def update_archive_item(id: ObjectId, archive_item: DecisionSystemArchiveItemPatch,
                              archive_service: IDecisionSystemArchiveItemServiceDep):
    updated_archive_item = await archive_service.modify_archive_item(id=id, archive_item=archive_item)
    if not updated_archive_item:
        raise HTTPException(status_code=404, detail="Archive item not found")
    return updated_archive_item


@router.delete("/archive-items/{id}", response_model=DecisionSystemArchiveItem)
async def delete_archive_item(id: ObjectId, archive_item_service: IDecisionSystemArchiveItemServiceDep):
    result = await archive_item_service.remove_archive_item(id=id)
    if not result:
        raise HTTPException(status_code=404, detail="Archive item not found")
    return result
