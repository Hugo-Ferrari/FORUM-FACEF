from fastapi import APIRouter

from .user_querys import get_user_req
from ..models.auth_type import AuthRegisterModel

router = APIRouter()
@router.get("/")
async def get_auth():
    data = AuthRegisterModel(code=26379, password="")
    return await get_user_req(data)