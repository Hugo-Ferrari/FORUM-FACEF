from dotenv import load_dotenv
from fastapi import Request, HTTPException, status
from starlette.middleware.base import BaseHTTPMiddleware
import jwt
import os

load_dotenv()

SECRET_KEY = os.getenv("JWT_SECRET", "supersecret")
ALGORITHM = "HS256"

class JWTAuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Só protege rotas que começam com /api
        if request.url.path.startswith("/api"):
            auth_header = request.headers.get("Authorization", "")
            token = auth_header.replace("Bearer ", "").strip()

            if not token:
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token JWT ausente")

            try:
                jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            except Exception as e:
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Token JWT inválido: {str(e)}")
        response = await call_next(request)
        return response

