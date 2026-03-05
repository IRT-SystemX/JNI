from typing import List
from odmantic import ObjectId
from brokers.storage_broker import StorageBroker
from models.foundations.decision_system_archive_items.DecisionSystemArchiveItem import DecisionSystemArchiveItem, \
    DecisionSystemArchiveItemPatch
from services.foundations.decision_system_archive_item_service_interface import IDecisionSystemArchiveItemService


class DecisionSystemArchiveItemService(IDecisionSystemArchiveItemService):
    def __init__(self, broker: StorageBroker):
        self.broker = broker

    async def add_archive_item(self, *, archive_item: DecisionSystemArchiveItem) -> DecisionSystemArchiveItem:
        maybe_archive_item = await self.broker.insert_archive_item(archive_item=archive_item)
        return maybe_archive_item

    async def retrieve_all_archive_items(self) -> List[DecisionSystemArchiveItem]:
        maybe_archive_items = await self.broker.select_all_archive_items()
        return maybe_archive_items

    async def retrieve_archive_item_by_id(self, *, id: ObjectId) -> DecisionSystemArchiveItem:
        maybe_archive_item = await self.broker.select_archive_item_by_id(id=id)
        return maybe_archive_item

    async def modify_archive_item(self, *, id: ObjectId,
                                  archive_item: DecisionSystemArchiveItemPatch) -> DecisionSystemArchiveItem:
        maybe_archive_item = await self.broker.update_archive_item(id=id, archive_item=archive_item)
        return maybe_archive_item

    async def remove_archive_item(self, *, id: ObjectId) -> DecisionSystemArchiveItem:
        maybe_archive_item = await self.broker.delete_archive_item(id=id)
        return maybe_archive_item
