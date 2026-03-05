from typing import List, TYPE_CHECKING

from odmantic import ObjectId

from models.foundations.task_templates.TaskTemplate import TaskTemplate, TaskTemplatePatch

if TYPE_CHECKING:
    from brokers.storage_broker import StorageBroker


class TaskTemplateStorageBroker:
    # This class shouldn't be instantiated.
    # The brokers are made to be used through the StorageBroker Class.
    def __new__(cls, *args, **kwargs):
        if cls is TaskTemplateStorageBroker:
            raise TypeError(f"Only children of '{cls.__name__}' may be instantiated, you should use StorageBroker.")
        return object.__new__(cls)

    async def insert_task_template(self: "StorageBroker", *,
                                       task_template: TaskTemplate) -> TaskTemplate:
        return await self._insert_document(document=task_template, document_type=TaskTemplate)

    async def select_all_task_templates(self: "StorageBroker") -> List[TaskTemplate]:
        return await self._select_all_documents(document_type=TaskTemplate)

    async def select_task_template_by_id(self: "StorageBroker", *, id: ObjectId) -> TaskTemplate:
        return await self._select_document_by_id(id=id, document_type=TaskTemplate)

    async def update_task_template(self: "StorageBroker", *, id: ObjectId,
                                       task_template: TaskTemplatePatch) -> TaskTemplate:
        return await self._update_document(id=id, document=task_template, document_type=TaskTemplate)

    async def delete_task_template(self: "StorageBroker", *, id: ObjectId) -> TaskTemplate:
        return await self._delete_document(id=id, document_type=TaskTemplate)
