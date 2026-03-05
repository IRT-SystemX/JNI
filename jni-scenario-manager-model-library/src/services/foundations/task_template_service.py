from typing import List

from odmantic import ObjectId

from brokers.storage_broker import StorageBroker
from models.foundations.task_templates.TaskTemplate import TaskTemplate, TaskTemplatePatch
from services.foundations.task_template_service_interface import ITaskTemplateService


class TaskTemplateService(ITaskTemplateService):
    def __init__(self, broker: StorageBroker):
        self.broker = broker

    async def add_task_template(self, *, task_template: TaskTemplate) -> TaskTemplate:
        maybe_task_template = await self.broker.insert_task_template(task_template=task_template)
        return maybe_task_template

    async def retrieve_all_task_templates(self) -> List[TaskTemplate]:
        maybe_task_templates = await self.broker.select_all_task_templates()
        return maybe_task_templates

    async def retrieve_task_template_by_id(self, *, id: ObjectId) -> TaskTemplate:
        maybe_task_template = await self.broker.select_task_template_by_id(id=id)
        return maybe_task_template

    async def modify_task_template(self, *, id: ObjectId, task_template: TaskTemplatePatch) -> TaskTemplate:
        maybe_task_template = await self.broker.update_task_template(id=id, task_template=task_template)
        return maybe_task_template

    async def remove_task_template(self, *, id: ObjectId) -> TaskTemplate:
        maybe_task_template = await self.broker.delete_task_template(id=id)
        return maybe_task_template
