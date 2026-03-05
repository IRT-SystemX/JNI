from typing import Annotated, List

from fastapi import APIRouter, Depends, status, HTTPException
from odmantic import ObjectId
from odmantic.exceptions import DuplicateKeyError, DocumentNotFoundError, DocumentParsingError

from brokers.storage_broker import StorageBroker
from models.foundations.task_templates.TaskTemplate import TaskTemplate, TaskTemplatePatch
from services.foundations.task_template_service_interface import ITaskTemplateService
from services.foundations.task_template_service import TaskTemplateService

router = APIRouter()

from functools import lru_cache
import config


@lru_cache
def get_settings():
    return config.Settings()


def get_storage_broker(settings):
    return StorageBroker(db_url=settings.db_url, db_name=settings.db_name)


def init_task_template_service():
    settings = get_settings()
    storage_broker = get_storage_broker(settings)
    service = TaskTemplateService(broker=storage_broker)
    return service


ITaskTemplateServiceDep = Annotated[ITaskTemplateService, Depends(init_task_template_service)]


@router.post("/tasks/", status_code=status.HTTP_201_CREATED, response_model=TaskTemplate)
async def create_task(task_template: TaskTemplate, task_service: ITaskTemplateServiceDep):
    try:
        inserted_task_template = await task_service.add_task_template(task_template=task_template)
        return inserted_task_template
    except DuplicateKeyError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=f"Duplicate key error: The task '{task_template}' already exists. Original error: {str(e.driver_error)}")
    except DocumentParsingError as e:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=f"Document parsing error: {str(e)}")
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except PermissionError as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))
    except Exception as e:
        print(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="An unexpected error occurred")


@router.get("/tasks/", response_model=List[TaskTemplate])
async def get_all_tasks(task_template_service: ITaskTemplateServiceDep):
    try:
        task_templates = await task_template_service.retrieve_all_task_templates()
        return task_templates
    except Exception as e:
        print(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="An unexpected error occurred")


@router.get("/tasks/{id}", response_model=TaskTemplate)
async def get_task(id: ObjectId, task_template_service: ITaskTemplateServiceDep):
    try:
        task_template = await task_template_service.retrieve_task_template_by_id(id=id)
        if not task_template:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
        return task_template
    except DocumentNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Document not found: {str(e)}")
    except Exception as e:
        print(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="An unexpected error occurred")


@router.patch("/tasks/{id}", response_model=TaskTemplate)
async def update_task(id: ObjectId, task_template: TaskTemplatePatch, task_service: ITaskTemplateServiceDep):
    try:
        updated_task = await task_service.modify_task_template(id=id, task_template=task_template)
        if not updated_task:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
        return updated_task
    except DuplicateKeyError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=f"Duplicate key error: The task '{task_template}' already exists. Original error: {str(e.driver_error)}")
    except DocumentParsingError as e:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=f"Document parsing error: {str(e)}")
    except DocumentNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Document not found: {str(e)}")
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except PermissionError as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))
    except Exception as e:
        print(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="An unexpected error occurred")


@router.delete("/tasks/{id}", response_model=TaskTemplate)
async def delete_task(id: ObjectId, task_template_service: ITaskTemplateServiceDep):
    try:
        result = await task_template_service.remove_task_template(id=id)
        if not result:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
        return result
    except DocumentNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Document not found: {str(e)}")
    except Exception as e:
        print(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="An unexpected error occurred")
