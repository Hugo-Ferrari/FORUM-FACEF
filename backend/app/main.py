import logging
from fastapi import FastAPI
from .auth.auth_routes import router as auth_routes
from fastapi.middleware.cors import CORSMiddleware
import socketio

# importa o sio criado em app/api/chat/server.py
from .api.chat.server import sio
from .api.chat import routes as chat_routes

# configura logging para debug e especificamente para socketio/engineio
logging.basicConfig(level=logging.DEBUG)
logging.getLogger('socketio').setLevel(logging.DEBUG)
logging.getLogger('engineio').setLevel(logging.DEBUG)

# Cria o FastAPI app normalmente
fastapi_app = FastAPI()

fastapi_app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://192.168.0.103:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@fastapi_app.get("/")
def get_root():
    return {"message": "Hello World | Inicio"}

fastapi_app.include_router(auth_routes, prefix="/auth")
# inclui as rotas do chat CRUD
fastapi_app.include_router(chat_routes.router, prefix="/api")

# Envolve a FastAPI app com o Socket.IO ASGIApp para que o socket.io trate os handshakes em /socket.io
sio_app = socketio.ASGIApp(sio, other_asgi_app=fastapi_app, socketio_path='/socket.io')

# Exponha sio_app como o objeto ASGI principal para o servidor (uvicorn apontará para app:app)
app = sio_app
