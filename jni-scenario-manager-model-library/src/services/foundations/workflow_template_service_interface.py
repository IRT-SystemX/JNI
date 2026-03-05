from abc import ABC, abstractmethod
from typing import List

from odmantic import ObjectId

from models.foundations.workflow_templates.WorkflowTemplate import WorkflowTemplate, WorkflowTemplatePatch


class IWorkflowTemplateService(ABC):
    """
    Defines an abstract base class for workflow template services, providing an interface
    for CRUD operations on workflow templates within a database.

    This service is foundational for managing workflow templates, including adding,
    retrieving, modifying, and removing workflow templates.
    """

    @abstractmethod
    async def add_workflow_template(self, *, workflow_template: WorkflowTemplate) -> WorkflowTemplate:
        """
        Asynchronously adds a new workflow template to the database.

        Args:
            workflow_template (WorkflowTemplate): The workflow template to add.

        Returns:
            WorkflowTemplate: The added workflow template, including its database ID and any
            other modifications made during the save process.
        """
        raise NotImplementedError

    @abstractmethod
    async def retrieve_all_workflow_templates(self) -> List[WorkflowTemplate]:
        """
        Asynchronously retrieves all workflow templates from the database.

        Returns:
            List[WorkflowTemplate]: A list of all workflow templates.
        """
        raise NotImplementedError

    @abstractmethod
    async def retrieve_workflow_template_by_id(self, *, id: ObjectId) -> WorkflowTemplate:
        """
        Asynchronously retrieves a workflow template by its ID.

        Args:
            id (ObjectId): The unique identifier of the workflow template to retrieve.

        Returns:
            WorkflowTemplate: The requested workflow template if found; otherwise, an exception may be raised.
        """
        raise NotImplementedError

    @abstractmethod
    async def modify_workflow_template(self, *, id: ObjectId,
                                       workflow_template: WorkflowTemplatePatch) -> WorkflowTemplate:
        """
        Asynchronously modifies an existing workflow template in the database.

        Args:
            id (ObjectId): The unique identifier of the workflow template to update.
            workflow_template (WorkflowTemplatePatch): The workflow template with modifications to save.

        Returns:
            WorkflowTemplate: The modified workflow template as saved in the database.
        """
        raise NotImplementedError

    @abstractmethod
    async def remove_workflow_template(self, *, id: ObjectId) -> WorkflowTemplate:
        """
        Asynchronously removes a workflow template from the database by its ID.

        Args:
            id (ObjectId): The unique identifier of the workflow template to remove.

        Returns:
            WorkflowTemplate: The deleted workflow template.
        """
        raise NotImplementedError
