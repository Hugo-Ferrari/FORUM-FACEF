"""
Servidor Socket.IO principal para o sistema de chat

Este módulo configura o servidor Socket.IO e registra todos os event handlers.

Baseado nos models:
- ChatsModel: id, name, is_general (bool), course_id, created_at
- ChatsMessageModel: id, chat_id, sender_id, content, created_at
- UserModel: id, facef_code, course_id, ...

Sistema simplificado usando apenas a tabela 'chats':
- Chat geral: is_general=True (todos têm acesso)
- Chat do curso: is_general=False + course_id (apenas alunos do curso)

Módulos:
- constants.py: Constantes e configurações
- database_service.py: Operações com banco de dados
- connection_handlers.py: Handlers de conexão/desconexão
- chat_handlers.py: Handlers para chats
"""
from fastapi import APIRouter
import socketio

# Importa handlers dos módulos especializados
from .connection_handlers import handle_connect, handle_init, handle_disconnect
from .room_handlers import handle_join_room, handle_leave_room, handle_room_message

# Configuração do servidor Socket.IO
sio = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins="*",
    logger=True,
    engineio_logger=True
)

router = APIRouter()


# ============================================================================
# EVENT HANDLERS - Conexão e Inicialização
# ============================================================================

@sio.event
async def connect(sid, environ, auth=None):
    """Evento de conexão do cliente"""
    await handle_connect(sio, sid, environ, auth)


@sio.event
async def init(sid, data):
    """Evento de inicialização da sessão do usuário"""
    await handle_init(sio, sid, data)


@sio.event
async def disconnect(sid):
    """Evento de desconexão do cliente"""
    await handle_disconnect(sio, sid)


# ============================================================================
# EVENT HANDLERS - Rooms (salas gerais e por curso)
# ============================================================================

@sio.event
async def join_room(sid, data):
    """Entra em uma room/sala"""
    await handle_join_room(sio, sid, data)


@sio.event
async def leave_room(sid, data):
    """Sai de uma room/sala"""
    await handle_leave_room(sio, sid, data)


@sio.event
async def room_message(sid, data):
    """Envia mensagem em uma room/sala"""
    await handle_room_message(sio, sid, data)


