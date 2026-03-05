from typing import List, TYPE_CHECKING

from odmantic import ObjectId

from models.foundations.workflow_templates.WorkflowTemplate import WorkflowTemplate, WorkflowTemplatePatch

if TYPE_CHECKING:
    from brokers.storage_broker import StorageBroker


class WorkflowTemplateStorageBroker:
    # This class shouldn't be instantiated.
    # The brokers are made to be used through the StorageBroker Class.
    def __new__(cls, *args, **kwargs):
        if cls is WorkflowTemplateStorageBroker:
            raise TypeError(f"Only children of '{cls.__name__}' may be instantiated, you should use StorageBroker.")
        return object.__new__(cls)

    async def insert_workflow_template(self: "StorageBroker", *,
                                       workflow_template: WorkflowTemplate) -> WorkflowTemplate:
        return await self._insert_document(document=workflow_template, document_type=WorkflowTemplate)

    async def select_all_workflow_templates(self: "StorageBroker") -> List[WorkflowTemplate]:
        return await self._select_all_documents(document_type=WorkflowTemplate)

    async def select_workflow_template_by_id(self: "StorageBroker", *, id: ObjectId) -> WorkflowTemplate:
        return await self._select_document_by_id(id=id, document_type=WorkflowTemplate)

    async def update_workflow_template(self: "StorageBroker", *, id: ObjectId,
                                       workflow_template: WorkflowTemplatePatch) -> WorkflowTemplate:
        return await self._update_document(id=id, document=workflow_template, document_type=WorkflowTemplate)

    async def delete_workflow_template(self: "StorageBroker", *, id: ObjectId) -> WorkflowTemplate:
        return await self._delete_document(id=id, document_type=WorkflowTemplate)
