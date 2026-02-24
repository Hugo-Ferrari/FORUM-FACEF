"""
Handlers de eventos Socket.IO para conexão e inicialização

Baseado no ChatsModel (tabela chats = rooms/salas):
- Room geral (is_general=True)
- Room do curso (course_id)
"""
import socketio
from .database_service import get_user_chats, fetch_chat_messages


async def handle_connect(sio: socketio.AsyncServer, sid: str, environ, auth=None):
    """
    Handler para evento de conexão do cliente

    Args:
        sio: Instância do servidor Socket.IO
        sid: ID da sessão do socket
        environ: Variáveis de ambiente da conexão
        auth: Dados de autenticação (opcional)
    """
    user_id = auth.get('user_id') if auth else None

    if not user_id:
        print(f'Conexão de {sid} sem user_id')
    else:
        await sio.save_session(sid, {'user_id': user_id})
        print(f'Cliente conectado: {sid} | Usuário: {user_id}')

    await sio.emit('welcome', {'msg': 'connected'}, to=sid)


async def handle_init(sio: socketio.AsyncServer, sid: str, data: dict):
    """
    Handler para inicialização da sessão do usuário

    Ações realizadas:
    1. Valida e salva o user_id na sessão
    2. Busca rooms do usuário (geral + do curso)
    3. Adiciona o usuário às rooms
    4. Envia histórico de mensagens de cada room
    5. Envia identificadores das rooms (room_general_id e room_course_id)

    Args:
        sio: Instância do servidor Socket.IO
        sid: ID da sessão do socket
        data: Dados enviados pelo cliente (deve conter user_id)
    """
    user_id = data.get('user_id')
    if not user_id:
        await sio.emit('error', {'msg': 'missing user_id'}, to=sid)
        return

    print(f'Inicialização: {sid} | Usuário: {user_id}')

    # Salva sessão do usuário
    await sio.save_session(sid, {'user_id': user_id})

    # Buscar rooms do usuário (geral + do curso)
    print(f'INIT: Buscando rooms do usuário {user_id}...')
    rooms = await get_user_chats(user_id)
    room_general_id = rooms.get('room_general_id')
    room_course_id = rooms.get('room_course_id')

    print(f'INIT: Rooms encontradas - Geral: {room_general_id}, Curso: {room_course_id}')

    # Entrar nas rooms disponíveis e enviar histórico
    if room_general_id:
        print(f'INIT: Entrando na room geral {room_general_id}')
        await sio.enter_room(sid, room_general_id)
        messages = await fetch_chat_messages(room_general_id)
        print(f'INIT: Enviando {len(messages)} mensagens da room geral')
        await sio.emit('room_history', {
            'room_id': room_general_id,
            'messages': messages
        }, to=sid)

    if room_course_id:
        print(f'INIT: Entrando na room do curso {room_course_id}')
        await sio.enter_room(sid, room_course_id)
        messages = await fetch_chat_messages(room_course_id)
        print(f'INIT: Enviando {len(messages)} mensagens da room do curso')
        await sio.emit('room_history', {
            'room_id': room_course_id,
            'messages': messages
        }, to=sid)

    # Enviar identificadores das rooms para o frontend saber qual usar
    await sio.emit('available_rooms', {
        'room_general_id': room_general_id,
        'room_course_id': room_course_id
    }, to=sid)


async def handle_disconnect(sio: socketio.AsyncServer, sid: str):
    """
    Handler para desconexão do cliente

    Args:
        sio: Instância do servidor Socket.IO
        sid: ID da sessão do socket
    """
    session = await sio.get_session(sid)
    user_id = session.get('user_id', 'desconhecido') if session else 'desconhecido'
    print(f'Cliente desconectado: {sid} | Usuário: {user_id}')
