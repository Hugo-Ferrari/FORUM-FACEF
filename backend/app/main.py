import logging
from fastapi import FastAPI
from .auth.auth_routes import router as auth_routes
from fastapi.middleware.cors import CORSMiddleware
import socketio

# importa o sio criado em app/api/chat/server.py
from .api.chat.server import sio
from .api.routes import router as api_router


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

# Cria o FastAPI app com configurações do Swagger
fastapi_app = FastAPI(
    title="FORUM FACEF API",
    description="""
    ## API do Fórum da FACEF
    
    Esta API fornece endpoints para gerenciar:
    * **Autenticação** - Login e registro de usuários
    * **Threads** - Tópicos do fórum organizados por curso
    * **Posts** - Respostas e comentários nas threads
    * **Votos** - Sistema de upvote/downvote para posts
    * **Chat** - Mensagens em tempo real via WebSocket
    
    ### 🌐 WebSocket
    Conecte-se ao chat em tempo real via: `ws://localhost:8000/api/ws`
    
    ### 🔐 Autenticação
    Muitas rotas requerem o header `user-id` para identificação do usuário.
    
    ### 📚 Documentação
    Acesse a especificação OpenAPI completa em: `/openapi.json`
    """,
    version="1.0.0",
    contact={
        "name": "uniFACEF Dev Team",
        "url": "https://unifacef.com.br",
    },
    openapi_tags=tags_metadata,
    docs_url="/docs",
    redoc_url=None,  # Desabilita ReDoc, mantém apenas Swagger
    openapi_url="/openapi.json"
)

fastapi_app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@fastapi_app.get("/", tags=["Root"])
def get_root():
    """
    Endpoint raiz da API

    Retorna uma mensagem de boas-vindas confirmando que a API está funcionando.
    """
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
