from typing import List, TYPE_CHECKING
from odmantic import ObjectId

from models.foundations.decision_system_archive_items.DecisionSystemArchiveItem import DecisionSystemArchiveItem, \
    DecisionSystemArchiveItemPatch

if TYPE_CHECKING:
    from brokers.storage_broker import StorageBroker


class DecisionSystemArchiveItemStorageBroker:
    # This class shouldn't be instantiated.
    # The brokers are made to be used through the StorageBroker Class.
    def __new__(cls, *args, **kwargs):
        if cls is DecisionSystemArchiveItemStorageBroker:
            raise TypeError(f"Only children of '{cls.__name__}' may be instantiated, you should use StorageBroker.")
        return object.__new__(cls)

    async def insert_archive_item(self: "StorageBroker", *,
                                  archive_item: DecisionSystemArchiveItem) -> DecisionSystemArchiveItem:
        return await self._insert_document(document=archive_item, document_type=DecisionSystemArchiveItem)

    async def select_all_archive_items(self: "StorageBroker") -> List[DecisionSystemArchiveItem]:
        return await self._select_all_documents(document_type=DecisionSystemArchiveItem)

    async def select_archive_item_by_id(self: "StorageBroker", *, id: ObjectId) -> DecisionSystemArchiveItem:
        return await self._select_document_by_id(id=id, document_type=DecisionSystemArchiveItem)

    async def update_archive_item(self: "StorageBroker", *, id: ObjectId,
                                  archive_item: DecisionSystemArchiveItemPatch) -> DecisionSystemArchiveItem:
        return await self._update_document(id=id, document=archive_item, document_type=DecisionSystemArchiveItem)

    async def delete_archive_item(self: "StorageBroker", *, id: ObjectId) -> DecisionSystemArchiveItem:
        return await self._delete_document(id=id, document_type=DecisionSystemArchiveItem)
