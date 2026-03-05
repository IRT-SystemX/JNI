from typing import List

from odmantic import ObjectId

from brokers.storage_broker import StorageBroker
from models.foundations.workflow_templates.WorkflowTemplate import WorkflowTemplate, WorkflowTemplatePatch
from services.foundations.workflow_template_service_interface import IWorkflowTemplateService


class WorkflowTemplateService(IWorkflowTemplateService):
    def __init__(self, broker: StorageBroker):
        self.broker = broker

    async def add_workflow_template(self, *, workflow_template: WorkflowTemplate) -> WorkflowTemplate:
        maybe_workflow_template = await self.broker.insert_workflow_template(workflow_template=workflow_template)
        return maybe_workflow_template

    async def retrieve_all_workflow_templates(self) -> List[WorkflowTemplate]:
        maybe_workflow_templates = await self.broker.select_all_workflow_templates()
        return maybe_workflow_templates

    async def retrieve_workflow_template_by_id(self, *, id: ObjectId) -> WorkflowTemplate:
        maybe_workflow_template = await self.broker.select_workflow_template_by_id(id=id)
        return maybe_workflow_template

    async def modify_workflow_template(self, *, id: ObjectId, workflow_template: WorkflowTemplatePatch) -> WorkflowTemplate:
        maybe_workflow_template = await self.broker.update_workflow_template(id=id,
                                                                             workflow_template=workflow_template)
        return maybe_workflow_template

    async def remove_workflow_template(self, *,id: ObjectId) -> WorkflowTemplate:
        maybe_workflow_template = await self.broker.delete_workflow_template(id=id)
        return maybe_workflow_template
