from abc import ABC, abstractmethod
from typing import List

from odmantic import ObjectId

from models.foundations.task_templates.TaskTemplate import TaskTemplate, TaskTemplatePatch


class ITaskTemplateService(ABC):
    """
    Defines an abstract base class for task template services, providing an interface
    for CRUD operations on task templates within a database.

    This service is foundational for managing task templates, including adding,
    retrieving, modifying, and removing task templates.
    """

    @abstractmethod
    async def add_task_template(self, *, task_template: TaskTemplate) -> TaskTemplate:
        """
        Asynchronously adds a new task template to the database.

        Args:
            task_template (TaskTemplate): The task template to add.

        Returns:
            TaskTemplate: The added task template, including its database ID and any
            other modifications made during the save process.
        """
        raise NotImplementedError

    @abstractmethod
    async def retrieve_all_task_templates(self) -> List[TaskTemplate]:
        """
        Asynchronously retrieves all task templates from the database.

        Returns:
            List[TaskTemplate]: A list of all task templates.
        """
        raise NotImplementedError

    @abstractmethod
    async def retrieve_task_template_by_id(self, *, id: ObjectId) -> TaskTemplate:
        """
        Asynchronously retrieves a task template by its ID.

        Args:
            id (ObjectId): The unique identifier of the task template to retrieve.

        Returns:
            TaskTemplate: The requested task template if found; otherwise, an exception may be raised.
        """
        raise NotImplementedError

    @abstractmethod
    async def modify_task_template(self, *, id: ObjectId,
                                       task_template: TaskTemplatePatch) -> TaskTemplate:
        """
        Asynchronously modifies an existing task template in the database.

        Args:
            id (ObjectId): The unique identifier of the task template to update.
            task_template (TaskTemplatePatch): The task template with modifications to save.

        Returns:
            TaskTemplate: The modified task template as saved in the database.
        """
        raise NotImplementedError

    @abstractmethod
    async def remove_task_template(self, *, id: ObjectId) -> TaskTemplate:
        """
        Asynchronously removes a task template from the database by its ID.

        Args:
            id (ObjectId): The unique identifier of the task template to remove.

        Returns:
            TaskTemplate: The deleted task template.
        """
        raise NotImplementedError
