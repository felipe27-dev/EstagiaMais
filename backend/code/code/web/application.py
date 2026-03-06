from code.log import configure_logging
from code.web.api.router import api_router
from code.web.lifespan import lifespan_setup

from fastapi import FastAPI
from fastapi.responses import UJSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os


def get_app() -> FastAPI:
    """
    Get FastAPI application.

    This is the main constructor of an application.

    :return: application.
    """
    configure_logging()
    app = FastAPI(
        title="Estagia+ API",
        lifespan=lifespan_setup,
        docs_url="/api/docs",
        redoc_url="/api/redoc",
        openapi_url="/api/openapi.json",
        default_response_class=UJSONResponse,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:5173"], 
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    os.makedirs("uploads", exist_ok=True)
    
    app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

    app.include_router(router=api_router, prefix="/api")

    return app
