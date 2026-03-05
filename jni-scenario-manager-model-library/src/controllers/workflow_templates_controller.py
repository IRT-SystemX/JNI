from typing import Annotated, List

from fastapi import APIRouter, Depends, status, HTTPException
from odmantic import ObjectId

from brokers.storage_broker import StorageBroker
from models.foundations.workflow_templates.WorkflowTemplate import WorkflowTemplate, WorkflowTemplatePatch
from services.foundations.workflow_template_service_interface import IWorkflowTemplateService
from services.foundations.workflow_template_service import WorkflowTemplateService

router = APIRouter()

from functools import lru_cache
import config


@lru_cache
def get_settings():
    return config.Settings()


def get_storage_broker(settings):
    return StorageBroker(db_url=settings.db_url, db_name=settings.db_name)


def init_workflow_template_service():
    settings = get_settings()
    storage_broker = get_storage_broker(settings)
    service = WorkflowTemplateService(broker=storage_broker)
    return service


IWorkflowTemplateServiceDep = Annotated[IWorkflowTemplateService, Depends(init_workflow_template_service)]


@router.post("/workflows/", status_code=status.HTTP_201_CREATED, response_model=WorkflowTemplate)
async def create_workflow(workflow_template: WorkflowTemplate, workflow_service: IWorkflowTemplateServiceDep):
    inserted_workflow_template = await workflow_service.add_workflow_template(workflow_template=workflow_template)
    return inserted_workflow_template


@router.get("/workflows/", response_model=List[WorkflowTemplate])
async def get_all_workflows(workflow_template_service: IWorkflowTemplateServiceDep):
    workflow_templates = await workflow_template_service.retrieve_all_workflow_templates()
    return workflow_templates


@router.get("/workflows/{id}", response_model=WorkflowTemplate)
async def get_workflow(id: ObjectId, workflow_template_service: IWorkflowTemplateServiceDep):
    workflow_template = await workflow_template_service.retrieve_workflow_template_by_id(id=id)
    if not workflow_template:
        raise HTTPException(status_code=404, detail="Workflow not found")
    return workflow_template


@router.patch("/workflows/{id}", response_model=WorkflowTemplate)
async def update_workflow(id: ObjectId, workflow_template: WorkflowTemplatePatch,
                          workflow_service: IWorkflowTemplateServiceDep):
    updated_workflow = await workflow_service.modify_workflow_template(id=id, workflow_template=workflow_template)
    if not updated_workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")
    return updated_workflow


@router.delete("/workflows/{id}", response_model=WorkflowTemplate)
async def delete_workflow(id: ObjectId, workflow_template_service: IWorkflowTemplateServiceDep):
    result = await workflow_template_service.remove_workflow_template(id=id)
    if not result:
        raise HTTPException(status_code=404, detail="Workflow not found")
    return result
