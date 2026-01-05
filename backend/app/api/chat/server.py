from fastapi import APIRouter
import socketio
from ..database.supabase_client import supabase
import asyncio

sio = socketio.AsyncServer(async_mode='asgi', cors_allowed_origins=["http://localhost:3000", "http://192.168.0.103:3000"], logger=True, engineio_logger=True)
router = APIRouter()
# NOTA: não construímos o ASGIApp aqui; ele será criado envolvendo o FastAPI app em main.py


async def fetch_chat_messages(chat_id: str):
    # Busca mensagens do chat no banco
    try:
        res = supabase.table('messages').select('*').eq('chat_id', chat_id).order('created_at', asc=True).execute()
        if res.status_code == 200:
            return res.data
    except Exception as e:
        print('db error fetch messages', e)
    return []


@sio.event
async def connect(sid, environ):
    print('connect', sid)
    # não forçamos associação a salas até recebermos o evento 'init' com user info
    await sio.emit('welcome', {'msg': 'connected'}, to=sid)


@sio.event
async def init(sid, data):
    """Esperamos que o cliente envie {'user_id': '...'} ao conectar.
    O servidor busca os chats do usuário e adiciona o socket às rooms correspondentes,
    além de enviar o histórico de mensagens para cada chat via evento 'chat_history'.
    """
    user_id = data.get('user_id')
    if not user_id:
        await sio.emit('error', {'msg': 'missing user_id'}, to=sid)
        return

    print(f'init from {sid} user={user_id}')
    # buscar chats do usuário
    try:
        res = supabase.table('chats_members').select('chat_id').eq('user_id', user_id).execute()
        if res.status_code != 200:
            print('db error list chats', res)
            return
        chat_ids = [r['chat_id'] for r in res.data]
    except Exception as e:
        print('db error list chats', e)
        chat_ids = []

    # juntar o socket nas rooms e enviar histórico
    for chat_id in chat_ids:
        sio.enter_room(sid, chat_id)
        # fetch messages async (não bloquear demais o handler)
        messages = await fetch_chat_messages(chat_id)
        await sio.emit('chat_history', {'chat_id': chat_id, 'messages': messages}, to=sid)


@sio.event
async def join_chat(sid, data):
    # data: {'chat_id': '...'}
    chat_id = data.get('chat_id')
    if not chat_id:
        await sio.emit('error', {'msg': 'missing chat_id'}, to=sid)
        return
    sio.enter_room(sid, chat_id)
    messages = await fetch_chat_messages(chat_id)
    await sio.emit('chat_history', {'chat_id': chat_id, 'messages': messages}, to=sid)


@sio.event
async def leave_chat(sid, data):
    chat_id = data.get('chat_id')
    if chat_id:
        sio.leave_room(sid, chat_id)


@sio.event
async def disconnect(sid):
    print('disconnect', sid)


@sio.event
async def chat_message(sid, data):
    # Espera data incluir chat_id + mensagem
    chat_id = data.get('chat_id')
    if chat_id:
        # salva no banco
        try:
            payload = data.get('message') or data
            # expected payload to include id, text, sender, time, created_at may be set by DB
            supabase.table('messages').insert({**payload, 'chat_id': chat_id}).execute()
        except Exception as e:
            print('db error insert message', e)
        # envia para room
        await sio.emit('chat_message', {'chat_id': chat_id, 'message': payload}, room=chat_id)
    else:
        # broadcast global
        await sio.emit('chat_message', data)
