from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from brokers.storage_broker import StorageBroker
from brokers.storage_broker._seed_data_on_startup import create_seed_data
from config import Settings
from controllers import status_controller, workflow_templates_controller, task_templates_controller, \
    decision_system_archive_items_controller


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("JNI1.WorkflowManager.Api is starting up...")
    try:
        app_settings = Settings()
        print('#################')
        print(app_settings)
        broker = StorageBroker(db_url=app_settings.db_url, db_name=app_settings.db_name)
        await create_seed_data(broker)
    except Exception as e:
        print(e)
    yield
    print("JNI1.WorkflowManager.Api has finished execution.")


app = FastAPI(lifespan=lifespan)

settings = Settings()
app.add_middleware(
    middleware_class=CORSMiddleware,
    allow_origins=settings.origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_PREFIX = "/api/v1"
app.include_router(status_controller.router, prefix=API_PREFIX)
app.include_router(workflow_templates_controller.router, prefix=API_PREFIX)
app.include_router(task_templates_controller.router, prefix=API_PREFIX)
app.include_router(decision_system_archive_items_controller.router, prefix=API_PREFIX)

if __name__ == "__main__":
    import uvicorn

    settings = Settings()
    base_host = settings.base_host
    base_port = settings.base_port

    config = uvicorn.Config("main:app", host=base_host, port=base_port, log_level="info")
    server = uvicorn.Server(config)
    server.run()
