from fastapi import Header

from ...auth.user_querys import check_token

"""
Serviços de acesso ao banco de dados para o sistema de chat

Baseado nos models:
- ChatsModel: id, name, is_general, course_id, created_at
- ChatsMessageModel: id, chat_id, sender_id, content, created_at
- UserModel: id, facef_code, course_id, ...
"""
from ...database.supabase_client import supabase
from .constants import MESSAGE_HISTORY_LIMIT

# Cache de mapeamento de nomes amigáveis para UUIDs
_room_cache = {}


async def get_room_uuid_by_name(room_name: str) -> str | None:
    """
    Mapeia nomes amigáveis (room_general, room_es, etc) para UUIDs reais do banco

    Args:
        room_name: Nome amigável da room (ex: 'room_general', 'room_es')

    Returns:
        UUID da room ou None se não encontrada
    """
    # Verifica cache primeiro
    if room_name in _room_cache:
        return _room_cache[room_name]

    try:
        # Busca room pelo campo 'name'
        print(f"MAPEAMENTO: Buscando room com name='{room_name}'")
        result = supabase.table('chats').select('id, name, is_general, course_id').eq('name', room_name).limit(1).execute()

        print(f"MAPEAMENTO: Resultado da query específica: {result.data}")

        if result.data and len(result.data) > 0:
            uuid = result.data[0]['id']
            _room_cache[room_name] = uuid  # Cacheia para próximas chamadas
            print(f"MAPEAMENTO: ✅ {room_name} -> {uuid}")
            return uuid

        print(f"MAPEAMENTO: ❌ Room '{room_name}' não encontrada")

        # Debug: Lista todas as rooms disponíveis SEM FILTROS
        print(f"MAPEAMENTO: Tentando listar TODAS as rooms...")
        all_rooms = supabase.table('chats').select('*').execute()
        print(f"MAPEAMENTO: Status code: {all_rooms.status_code if hasattr(all_rooms, 'status_code') else 'N/A'}")
        print(f"MAPEAMENTO: Total de rooms retornadas: {len(all_rooms.data) if all_rooms.data else 0}")
        print(f"MAPEAMENTO: Rooms disponíveis: {all_rooms.data}")

        if not all_rooms.data or len(all_rooms.data) == 0:
            print(f"MAPEAMENTO: ⚠️ AVISO: Nenhuma room encontrada no banco! Possível problema de RLS (Row Level Security) no Supabase")

        return None

    except Exception as e:
        print(f'MAPEAMENTO: ⚠️ Erro ao mapear room name {room_name}:', e)
        import traceback
        traceback.print_exc()
        return None


async def fetch_chat_messages(chat_id: str):
    """
    Busca mensagens do chat no banco de dados

    Converte campos do banco (content, sender_id UUID) para formato do frontend (text, sender facef_code)

    Args:
        chat_id: ID do chat ou room

    Returns:
        Lista de mensagens ordenadas por data de criação
    """
    try:
        res = supabase.table('chat_messages')\
            .select('*, users:sender_id(facef_code, name)')\
            .eq('chat_id', chat_id)\
            .order('created_at', desc=False)\
            .execute()

        if res.data:
            messages = []
            for msg in res.data:
                user_data = msg.get('users')

                if user_data:
                    sender = user_data.get('facef_code')
                    sender_name = user_data.get('name', 'Usuário')
                else:
                    sender = msg.get('sender_id')
                    sender_name = 'Usuário'

                frontend_msg = {
                    'id': msg.get('id'),
                    'text': msg.get('content'),
                    'sender': sender,
                    'sender_name': sender_name,
                    'created_at': msg.get('created_at'),
                    'chat_id': msg.get('chat_id')
                }
                messages.append(frontend_msg)

            return messages
    except Exception as e:
        print(f'Erro ao buscar mensagens do chat {chat_id}:', e)
        import traceback
        traceback.print_exc()
    return []


async def fetch_chat_messages_limited(chat_id: str, limit: int = MESSAGE_HISTORY_LIMIT):
    """
    Busca as últimas N mensagens do chat

    Args:
        chat_id: ID do chat ou room
        limit: Número máximo de mensagens a retornar

    Returns:
        Lista com as últimas N mensagens
    """
    try:
        res = supabase.table('chat_messages')\
            .select('*')\
            .eq('chat_id', chat_id)\
            .order('created_at', desc=False)\
            .limit(limit)\
            .execute()

        if res.data:
            return res.data
    except Exception as e:
        print(f'Erro ao buscar histórico de mensagens do chat {chat_id}:', e)
    return []


async def save_message(message_data: dict, chat_id: str):
    """
    Salva uma nova mensagem no banco de dados

    Args:
        message_data: Dados da mensagem do frontend (id, text, sender, sender_name, etc)
        chat_id: ID do chat ou room

    Returns:
        True se salvou com sucesso, False caso contrário
    """
    print(f"SAVE MESSAGE: Salvando mensagem no chat {chat_id}: {message_data}")
    try:
        sender = message_data.get('sender')

        # Se sender for facef_code (int ou string numérica), converte para UUID do usuário
        sender_uuid = sender
        if sender:
            # Verifica se parece ser um facef_code (número ou string numérica pequena)
            # UUIDs têm 36 caracteres, facef_code são números menores
            sender_str = str(sender)
            if len(sender_str) < 20:  # Não é um UUID
                print(f"SAVE MESSAGE: Convertendo facef_code {sender} para UUID...")
                try:
                    user_data = supabase.table('users')\
                        .select('id')\
                        .eq('facef_code', int(sender_str))\
                        .limit(1)\
                        .execute()

                    if user_data.data and len(user_data.data) > 0:
                        sender_uuid = user_data.data[0]['id']
                        print(f"SAVE MESSAGE: UUID encontrado: {sender_uuid}")
                    else:
                        print(f"SAVE MESSAGE: ⚠️ Usuário com facef_code {sender} não encontrado!")
                        return False
                except ValueError:
                    # Se não conseguir converter para int, assume que já é UUID
                    print(f"SAVE MESSAGE: sender não é numérico, assumindo UUID: {sender}")
                    pass

        # Mapeia campos do frontend para o modelo do banco
        db_message = {
            'chat_id': chat_id,
            'sender_id': sender_uuid,
            'content': message_data.get('text'),
        }

        print(f"SAVE MESSAGE: Salvando no banco: {db_message}")

        result = supabase.table('chat_messages').insert(db_message).execute()

        # Verifica se houve erro na resposta
        if hasattr(result, 'error') and result.error:
            print(f"SAVE MESSAGE: ❌ Erro do Supabase: {result.error}")
            return False

        print(f"SAVE MESSAGE: ✅ Mensagem salva com sucesso - Response: {result.data}")
        return True
    except Exception as e:
        print(f'SAVE MESSAGE: ❌ Erro ao salvar mensagem no chat {chat_id}:', e)
        import traceback
        traceback.print_exc()
        return False


async def get_user_chats(user_id: str):
    """
    Busca todos os chats que o usuário participa

    Baseado no ChatsModel:
    - Busca chats do mesmo course_id do usuário
    - Inclui chat geral (is_general=True)

    Args:
        user_id: facef_code do usuário

    Returns:
        Dict com room_general_id e room_course_id
    """
    try:
        # user é um dicionário, não um objeto UserModel
        user_data = supabase.table('users').select('course_id').eq('facef_code', int(user_id)).execute().data

        if not user_data or len(user_data) == 0:
            print(f'Usuário {user_id} não encontrado')
            return {'room_general_id': None, 'room_course_id': None}

        course_id = user_data[0]['course_id']
        print(f"GET ROOMS User course_id: {course_id}")

        # Busca room geral
        general_room = supabase.table('chats')\
            .select('id')\
            .eq('is_general', True)\
            .limit(1)\
            .execute().data

        general_room_id = general_room[0]['id'] if general_room else None
        print(f"GET ROOMS Room geral encontrada: {general_room_id}")

        # Busca room do curso
        course_room = supabase.table('chats')\
            .select('id')\
            .eq('course_id', course_id)\
            .eq('is_general', False)\
            .limit(1)\
            .execute().data

        course_room_id = course_room[0]['id'] if course_room else None
        print(f"GET ROOMS Room do curso encontrada: {course_room_id}")

        return {
            'room_general_id': general_room_id,
            'room_course_id': course_room_id
        }

    except Exception as e:
        print(f'Erro ao buscar chats do usuário {user_id}:', e)
        return {'room_general_id': None, 'room_course_id': None}


async def check_user_in_chat(user_id: str, room_id: str):
    """
    Verifica se o usuário tem acesso a uma room específica

    Baseado no ChatsModel:
    - Room geral (is_general=True): Todos têm acesso
    - Room do curso (course_id): Apenas alunos do mesmo curso

    Args:
        user_id: facef_code do usuário
        room_id: UUID da room na tabela chats (já deve estar mapeado)

    Returns:
        True se o usuário tem acesso, False caso contrário
    """
    try:
        # Valida se room_id parece ser um UUID
        if not room_id or len(room_id) < 8:
            print(f"CHECK ROOM: room_id inválido: {room_id}")
            return False

        # Busca a room pelo ID (UUID)
        room_data = supabase.table('chats').select('is_general, course_id').eq('id', room_id).execute().data

        if not room_data or len(room_data) == 0:
            print(f"CHECK ROOM: Room {room_id} não encontrada na tabela chats")
            return False

        room = room_data[0]

        # Se é room geral, todos têm acesso
        if room.get('is_general'):
            print(f"CHECK ROOM: {room_id} é room geral, acesso permitido")
            return True

        # Se não é geral, verifica se o usuário é do mesmo curso
        user_data = supabase.table('users').select('course_id').eq('facef_code', int(user_id)).execute().data

        if not user_data or len(user_data) == 0:
            print(f"CHECK ROOM: Usuário {user_id} não encontrado")
            return False

        user_course_id = user_data[0]['course_id']
        room_course_id = room.get('course_id')

        has_access = user_course_id == room_course_id
        print(f"CHECK ROOM: User course={user_course_id}, Room course={room_course_id}, Access={has_access}")

        return has_access

    except Exception as e:
        print(f'Erro ao verificar permissão do usuário {user_id} na room {room_id}:', e)
        return False
