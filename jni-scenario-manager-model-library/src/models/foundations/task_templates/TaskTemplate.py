from odmantic import Model, Index, Field
from pydantic import BaseModel


class TaskTemplate(Model):
    name: str = Field(index=True, unique=True)
    code_block: str
    description: str

    model_config = {
        "indexes": lambda: [
            Index(TaskTemplate.name, name="name_index")
        ],
        "collection": "task_templates"
    }


class TaskTemplatePatch(BaseModel):
    code_block: str
    description: str
