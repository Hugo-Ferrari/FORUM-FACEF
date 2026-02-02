
from ...models.user_type import UserModel
from ...models.auth_type import AuthRegisterModel
from ..supabase_client import supabase
from typing import Optional

async def get_user_req(register: AuthRegisterModel) -> Optional[UserModel]:
    try:
        res = supabase.table("users").select("*").eq("facef_code", register.code).execute()
        print(res)
        return res.data
    except Exception as e:
        print(e)
        return None


async def get_user_by_id(user_id: str) -> Optional[dict]:
    """Busca usuário por ID e retorna seus dados"""
    try:
        res = supabase.table("users").select("*").eq("id", user_id).execute()
        if res.status_code == 200 and res.data:
            return res.data[0]
        return None
    except Exception as e:
        print(f"Error fetching user by id: {e}")
        return None
