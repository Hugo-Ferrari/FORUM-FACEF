from fastapi import APIRouter, HTTPException, Header
from .user_querys import get_user_req
from ..models.auth_type import AuthRegisterModel
import jwt
import os
from fastapi import status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi import Security

router = APIRouter()

SECRET_KEY = os.getenv("JWT_SECRET", "supersecret")
ALGORITHM = "HS256"

@router.post("/login")
async def login(data: AuthRegisterModel):
    print(f"LOG: INIT LOGIN WITH DATA:{data}")

    try:
        user_data = await get_user_req(data)
        print(f"LOG: USER DATA: {user_data}")


        # user_data pode ser None ou uma lista de dicts
        if not user_data or not isinstance(user_data, list) or len(user_data) == 0:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Credenciais inválidas")

        user = user_data[0]
        print(f"LOG: USER: {user}")

        payload = {
            "sub": user["id"],
            "code": user["facef_code"]
        }

        token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
        print(f"LOG: TOKEN GENERATED: {token}")
        return {"access_token": token, "token_type": "bearer"}
    except Exception as e:
        print(f"ERROR: got a error when do a login {e}")
        return {"message": "Erro ao fazer login"}



@router.get("/user")
async def get_user(authorization: str = Header(...)):
    """Obter dados do usuário autenticado via token JWT"""
    print(f"LOG: GET USER FROM TOKEN {authorization}")
    token = authorization.replace("Bearer ", "").strip()

    try:
        decoded = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        data = AuthRegisterModel(code=decoded["facef_code"], password="")
        print(f"LOG: DECODED TOKEN DATA: {decoded}")

        try:
            user_data = await get_user_req(data)
            print(f"LOG: GETTING THE USER INFO {user_data}")

            if not user_data or not isinstance(user_data, list) or len(user_data) == 0:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuário não encontrado")

            return user_data[0]
        except Exception as e:
            print(f"ERROR: {e}")

    except jwt.PyJWTError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Token inválido: {str(e)}")

@router.get("/")
async def get_auth(credentials: HTTPAuthorizationCredentials = Security(HTTPBearer())):
    """Validar token e obter dados do usuário"""
    token = credentials.credentials
    try:
        decoded = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        data = AuthRegisterModel(code=decoded["facef_code"], password="")
        user_data = await get_user_req(data)

        if not user_data or not isinstance(user_data, list) or len(user_data) == 0:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuário não encontrado")

        return user_data[0]
    except jwt.PyJWTError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Token inválido: {str(e)}")
