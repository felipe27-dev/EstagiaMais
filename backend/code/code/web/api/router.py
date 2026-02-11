from code.web.api import echo, monitoring

from fastapi.routing import APIRouter

api_router = APIRouter()
api_router.include_router(monitoring.router)
api_router.include_router(echo.router, prefix="/echo", tags=["echo"])
