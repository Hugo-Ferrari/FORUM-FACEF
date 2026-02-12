from fastapi import FastAPI
from .auth.auth_routes import router as auth_routes
from fastapi.middleware.cors import CORSMiddleware
import socketio
import json
import os
from starlette.middleware import Middleware


# importa o sio criado em app/api/chat/server.py
from .api.chat.server import sio
from .api.routes import router as api_router
from .auth.middleware import JWTAuthMiddleware


# Metadados para documentação Swagger/OpenAPI
tags_metadata = [
    {
        "name": "Root",
        "description": "Endpoint raiz da API"
    },
    {
        "name": "Auth",
        "description": "Operações de autenticação e autorização de usuários"
    },
    {
        "name": "Chat",
        "description": "Operações relacionadas a chats e mensagens (REST). WebSocket disponível em `/api/ws`"
    },
    {
        "name": "Threads",
        "description": "Operações CRUD para threads do fórum"
    },
    {
        "name": "Posts",
        "description": "Operações CRUD para posts dentro de threads"
    },
    {
        "name": "Post Votes",
        "description": "Sistema de votação (upvote/downvote) para posts"
    }
]

middleware = [
    Middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    ),
    Middleware(JWTAuthMiddleware),
]


# Cria o FastAPI app com configurações do Swagger
fastapi_app = FastAPI(
    title="FORUM FACEF API",
    version="1.0.0",
    openapi_tags=tags_metadata,
    docs_url="/docs",
    openapi_url="/openapi.json",
    middleware=middleware
)


@fastapi_app.get("/", tags=["Root"])
def get_root():

    return {
        "message": "Hello World | Inicio",
        "version": "1.0.0",
        "docs": "/docs",
        "websocket": "/api/ws"
    }

fastapi_app.include_router(auth_routes, prefix="/auth", tags=["Auth"])
fastapi_app.include_router(api_router, prefix="/api")

sio_app = socketio.ASGIApp(sio, other_asgi_app=fastapi_app, socketio_path='/api/ws')

app = sio_app

def custom_openapi():
    if fastapi_app.openapi_schema:
        return fastapi_app.openapi_schema

    openapi_path = os.path.join(os.path.dirname(__file__), "openapi.json")
    with open(openapi_path, "r", encoding="utf-8") as f:
        openapi_schema = json.load(f)

    fastapi_app.openapi_schema = openapi_schema
    return fastapi_app.openapi_schema

fastapi_app.openapi = custom_openapi
