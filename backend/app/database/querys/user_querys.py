
from ...models.auth_type import AuthUserModel
from ...models.auth_type import AuthRegisterModel
from ..supabase_client import supabase
import requests
from typing import Optional


async def get_user_req(register: AuthRegisterModel) -> Optional[AuthUserModel]:
    try:
        res = supabase.table("users").select("*").eq("facef_code", register.code).execute()
        print(res)
        return res.data
    except Exception as e:
        print(e)
        return None


