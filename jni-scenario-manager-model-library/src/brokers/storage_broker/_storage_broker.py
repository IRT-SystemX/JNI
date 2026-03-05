from typing import TypeVar, Type, List, Any

from fastapi import HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from odmantic import AIOEngine, Model, ObjectId
from odmantic.exceptions import DocumentNotFoundError

from brokers.storage_broker.decision_system_archive_item_storage_broker import DecisionSystemArchiveItemStorageBroker
from brokers.storage_broker.task_template_storage_broker import TaskTemplateStorageBroker
from brokers.storage_broker.workflow_template_storage_broker import WorkflowTemplateStorageBroker
from models.foundations.task_templates.TaskTemplate import TaskTemplate
from models.foundations.workflow_templates.WorkflowTemplate import WorkflowTemplate

T = TypeVar("T", bound=Model)
T_Type = TypeVar("_TSelectParam")


class StorageBroker(WorkflowTemplateStorageBroker, TaskTemplateStorageBroker, DecisionSystemArchiveItemStorageBroker):
    def __init__(self, *, db_url: str, db_name: str):
        self.client = AsyncIOMotorClient(db_url)
        self.engine = AIOEngine(client=self.client, database=db_name)
        self.session = self.engine.session()

    def __delete__(self, instance):
        self.session.end()

    async def start_session(self):
        try:
            await self.engine.configure_database(models=[TaskTemplate, WorkflowTemplate], update_existing_indexes=True)
        except Exception as e:
            print(e)

        if not self.session.is_started:
            await self.session.start()

    async def _insert_document(self, *, document: T, document_type: Type[T_Type]) -> T:
        await self.start_session()
        if document.id:
            maybe_document = await self.session.find_one(document_type, document_type.id == document.id)
            if maybe_document:
                raise HTTPException(status_code=409,
                                    detail=f"The document named '{str(document.name).removesuffix('.name')}' with the id '{str(document.id).removesuffix('.id')}' already exists")

        await self.session.save(document)
        return document

    async def _select_all_documents(self, *, document_type: Type[T_Type]) -> List[T]:
        await self.start_session()
        document_list = await self.session.find(document_type)
        return document_list

    async def _select_document_by_id(self, *, id: ObjectId, document_type: Type[T_Type]) -> T:
        await self.start_session()
        maybe_document = await self.session.find_one(document_type, document_type.id == id)
        if maybe_document is None:
            raise HTTPException(404)
        document = maybe_document
        return document

    async def _update_document(self, *, id: ObjectId, document: Any, document_type: Type[T_Type]) -> T:
        await self.start_session()
        original_document = await self.session.find_one(document_type, document_type.id == id)
        if original_document is None:
            raise HTTPException(404)
        original_document.model_update(document)
        await self.session.save(original_document)
        return original_document

    async def _delete_document(self, id: ObjectId, document_type: Type[T_Type]) -> T_Type:
        await self.start_session()
        document_to_delete = await self.session.find_one(document_type, document_type.id == id)
        if document_to_delete is None:
            raise HTTPException(404)
        await self.session.delete(document_to_delete)
        deleted_document = document_to_delete
        return deleted_document
