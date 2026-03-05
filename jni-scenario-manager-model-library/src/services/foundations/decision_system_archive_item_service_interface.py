from abc import ABC, abstractmethod
from typing import List
from odmantic import ObjectId
from models.foundations.decision_system_archive_items.DecisionSystemArchiveItem import DecisionSystemArchiveItem, \
    DecisionSystemArchiveItemPatch


class IDecisionSystemArchiveItemService(ABC):
    """
    Defines an abstract base class for decision system archive item services, providing an interface
    for CRUD operations on archive items within a database.
    This service is foundational for managing decision system archive items, including adding,
    retrieving, modifying, and removing archive items.
    """

    @abstractmethod
    async def add_archive_item(self, *, archive_item: DecisionSystemArchiveItem) -> DecisionSystemArchiveItem:
        """
        Asynchronously adds a new archive item to the database.
        Args:
            archive_item (DecisionSystemArchiveItem): The archive item to add.
        Returns:
            DecisionSystemArchiveItem: The added archive item, including its database ID and any
            other modifications made during the save process.
        """
        raise NotImplementedError

    @abstractmethod
    async def retrieve_all_archive_items(self) -> List[DecisionSystemArchiveItem]:
        """
        Asynchronously retrieves all archive items from the database.
        Returns:
            List[DecisionSystemArchiveItem]: A list of all archive items.
        """
        raise NotImplementedError

    @abstractmethod
    async def retrieve_archive_item_by_id(self, *, id: ObjectId) -> DecisionSystemArchiveItem:
        """
        Asynchronously retrieves an archive item by its ID.
        Args:
            id (ObjectId): The unique identifier of the archive item to retrieve.
        Returns:
            DecisionSystemArchiveItem: The requested archive item if found; otherwise, an exception may be raised.
        """
        raise NotImplementedError

    @abstractmethod
    async def modify_archive_item(self, *, id: ObjectId,
                                  archive_item: DecisionSystemArchiveItemPatch) -> DecisionSystemArchiveItem:
        """
        Asynchronously modifies an existing archive item in the database.
        Args:
            id (ObjectId): The unique identifier of the archive item to update.
            archive_item (DecisionSystemArchiveItemPatch): The archive item with modifications to save.
        Returns:
            DecisionSystemArchiveItem: The modified archive item as saved in the database.
        """
        raise NotImplementedError

    @abstractmethod
    async def remove_archive_item(self, *, id: ObjectId) -> DecisionSystemArchiveItem:
        """
        Asynchronously removes an archive item from the database by its ID.
        Args:
            id (ObjectId): The unique identifier of the archive item to remove.
        Returns:
            DecisionSystemArchiveItem: The deleted archive item.
        """
        raise NotImplementedError
