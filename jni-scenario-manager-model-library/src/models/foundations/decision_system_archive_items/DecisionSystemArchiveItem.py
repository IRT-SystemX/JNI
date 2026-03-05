from odmantic import Model, Index, Field
from datetime import datetime

from pydantic import BaseModel


class DecisionSystemArchiveItem(Model):
    workflow_execution_id: str = Field(index=True, unique=True)
    workflow_name: str
    aas_name: str
    property_name: str
    workflow_execution_date: datetime
    updated_date: datetime
    user_id: str = Field(index=True)

    model_config = {
        "indexes": lambda: [
            Index(DecisionSystemArchiveItem.workflow_execution_id, name="workflow_execution_id"),
            Index(DecisionSystemArchiveItem.user_id, name="user_id_index")
        ],
        "collection": "decision_system_archive_items"
    }


class DecisionSystemArchiveItemPatch(BaseModel):
    aas_name: str
    workflow_name: str
    property_name: str
