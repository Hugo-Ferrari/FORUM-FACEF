"""
Handlers de eventos Socket.IO para gerenciamento de rooms

Baseado no ChatsModel (tabela chats = rooms/salas):
- Room geral (is_general=True) - todos têm acesso
- Room do curso (is_general=False + course_id) - apenas alunos do curso

Frontend pode enviar nomes amigáveis (room_general, room_es, etc)
Backend mapeia para UUIDs reais do banco
"""
import socketio
from .database_service import fetch_chat_messages, save_message, check_user_in_chat, get_room_uuid_by_name


async def handle_join_room(sio: socketio.AsyncServer, sid: str, data: dict):
    """
    Handler para entrar em uma room/sala

    Aceita tanto nomes amigáveis (room_general, room_es) quanto UUIDs diretos

    Args:
        sio: Instância do servidor Socket.IO
        sid: ID da sessão do socket
        data: Dados contendo room_id
    """
    room_id = data.get('room_id')
    if not room_id:
        await sio.emit('error', {'msg': 'missing room_id'}, to=sid)
        return

    # Se for nome amigável (não parece UUID), mapeia para UUID real
    if len(room_id) < 30:  # UUIDs têm 36 chars, nomes amigáveis são menores
        real_uuid = await get_room_uuid_by_name(room_id)
        if not real_uuid:
            await sio.emit('error', {'msg': f'Room "{room_id}" não encontrada'}, to=sid)
            return
        print(f"JOIN ROOM: Mapeando {room_id} -> {real_uuid}")
        room_id = real_uuid

    # Verifica autenticação
    session = await sio.get_session(sid)
    user_id = session.get('user_id') if session else None

    if not user_id:
        await sio.emit('error', {'msg': 'user not authenticated'}, to=sid)
        return

    # Verifica se o usuário tem acesso a esta room
    # ChatsModel: is_general=True permite todos, senão verifica course_id
    has_access = await check_user_in_chat(user_id, room_id)
    if not has_access:
        await sio.emit('error', {'msg': 'no permission for this room'}, to=sid)
        return

    # Entra na room e envia histórico
    await sio.enter_room(sid, room_id)

    print(f"JOIN ROOM: ✅ Cliente {sid} (user={user_id}) entrou na room {room_id}")

    # Verifica quantos clientes estão na room agora
    try:
        room_participants = list(sio.manager.get_participants('/', room_id))
        print(f"JOIN ROOM: Total de {len(room_participants)} cliente(s) na room agora")
    except Exception as e:
        print(f"JOIN ROOM: Erro ao verificar participantes: {e}")

    messages = await fetch_chat_messages(room_id)
    print(f"JOIN ROOM: Enviando {len(messages)} mensagens do histórico")

    await sio.emit('room_history', {
        'room_id': room_id,
        'messages': messages
    }, to=sid)


async def handle_leave_room(sio: socketio.AsyncServer, sid: str, data: dict):
    """
    Handler para sair de uma room/sala

    Args:
        sio: Instância do servidor Socket.IO
        sid: ID da sessão do socket
        data: Dados contendo room_id
    """
    room_id = data.get('room_id')
    if room_id:
        await sio.leave_room(sid, room_id)


async def handle_room_message(sio: socketio.AsyncServer, sid: str, data: dict):
    """
    Handler para enviar mensagem em uma room/sala

    Aceita tanto nomes amigáveis (room_general, room_es) quanto UUIDs diretos

    Args:
        sio: Instância do servidor Socket.IO
        sid: ID da sessão do socket
        data: Dados contendo room_id e message
    """
    room_id = data.get('room_id')
    if not room_id:
        await sio.emit('error', {'msg': 'missing room_id'}, to=sid)
        return

    # Guarda o room_id original para retornar ao frontend
    original_room_id = room_id

    # Se for nome amigável (não parece UUID), mapeia para UUID real
    if len(room_id) < 30:  # UUIDs têm 36 chars, nomes amigáveis são menores
        real_uuid = await get_room_uuid_by_name(room_id)
        if not real_uuid:
            await sio.emit('error', {'msg': f'Room "{room_id}" não encontrada'}, to=sid)
            return
        print(f"ROOM MESSAGE: Mapeando {room_id} -> {real_uuid}")
        room_id = real_uuid  # Usa UUID para operações internas

    # Verifica autenticação
    session = await sio.get_session(sid)
    user_id = session.get('user_id') if session else None

    if not user_id:
        await sio.emit('error', {'msg': 'user not authenticated'}, to=sid)
        return

    # Verifica se o usuário tem acesso a esta room
    # ChatsModel: is_general=True permite todos, senão verifica course_id
    has_access = await check_user_in_chat(user_id, room_id)
    if not has_access:
        await sio.emit('error', {'msg': 'no permission for this room'}, to=sid)
        return

    # Prepara e salva a mensagem
    payload = data.get('message') or data

    print(f"ROOM MESSAGE: Recebido de {user_id} para room {original_room_id} (UUID: {room_id})")
    print(f"ROOM MESSAGE: Payload: {payload}")

    save_result = await save_message(payload, room_id)

    if not save_result:
        print(f"ROOM MESSAGE: ⚠️ Falha ao salvar mensagem, mas continuando broadcast")

    # Verifica quantos clientes estão na room
    try:
        room_participants = list(sio.manager.get_participants('/', room_id))
        print(f"ROOM MESSAGE: 📢 Broadcasting para {len(room_participants)} cliente(s) na room {room_id}")
        print(f"ROOM MESSAGE: Participantes: {room_participants}")
    except Exception as e:
        print(f"ROOM MESSAGE: Erro ao verificar participantes: {e}")

    # Transmite mensagem para todos os membros da room
    # IMPORTANTE: Retorna o room_id ORIGINAL (nome amigável) para o frontend
    await sio.emit('room_response', {
        'room_id': original_room_id,  # Envia o nome amigável de volta
        'message': payload
    }, room=room_id)  # Mas usa o UUID para enviar para a room correta

    print(f"ROOM MESSAGE: ✅ Broadcast enviado com room_id={original_room_id}")

