from odmantic import Model, Index, Field
from pydantic import BaseModel


class WorkflowTemplate(Model):
    name: str = Field(index=True)
    code_block: str
    description: str

    model_config = {
        "indexes": lambda: [
            Index(WorkflowTemplate.name, name="name_index")
        ],
        "collection": "workflow_templates"
    }


class WorkflowTemplatePatch(BaseModel):
    code_block: str
    description: str
