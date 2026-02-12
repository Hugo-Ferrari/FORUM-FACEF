import os

import jwt
from ..models.user_type import UserModel
from ..models.auth_type import AuthRegisterModel
from ..database.supabase_client import supabase
from typing import Optional

from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("JWT_SECRET")

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
        if res.data:
            return res.data[0]
        return None
    except Exception as e:
        print(f"Error fetching user by id: {e}")
        return None

async def check_token(token: str) -> str | None:
    print(f"LOG: CHECK TOKEN {token}")
    try:
        res = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        print(f"LOG: DECODED TOKEN {res}")

        user_id = res["sub"]

        try:
            res = await get_user_by_id(user_id)
            if not res:
                return None

            return res["id"]
        except Exception as e:
            print(e)
            return None

    except Exception as e:
        print(f"Error decoding token: {e}")
        return None
