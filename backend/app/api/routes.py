from fastapi import APIRouter
from .threads.threads_routes import router as threads_routes
from .chat.routes import router as chat_routes

router = APIRouter()

router.include_router(chat_routes, prefix="/chat", tags=["Chat"])
router.include_router(threads_routes, prefix="/threads")



@router.get("/", status_code=200, tags=["Root"])
def root():
    return {"message": "API /api rodando!"}
