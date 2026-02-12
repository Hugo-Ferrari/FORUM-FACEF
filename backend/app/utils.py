import jwt
from fastapi import Header, HTTPException, status
import os

SECRET_KEY = os.getenv("JWT_SECRET", "supersecret")
ALGORITHM = "HS256"

def get_current_user(authorization: str = Header(...)) -> dict:
    token = authorization.replace("Bearer ", "")
    try:
        decoded = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        print(decoded)
        user_id = decoded.get("sub")
        facef_code = decoded.get("facef_code")
        if not user_id or not facef_code:
            raise ValueError("Token inválido: 'sub' ou 'facef_code' não encontrado")
        return {"user_id": user_id, "facef_code": facef_code}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Token inválido: {str(e)}")
