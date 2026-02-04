"""
Serviços de controle de acesso e permissões para rooms
"""
from backend.app.auth.user_querys import get_user_by_id


async def get_user_private_rooms(user_id: str):
    """
    Busca quais rooms privadas o usuário tem acesso baseado no course_id

    Args:
        user_id: ID do usuário

    Returns:
        Lista com o ID da room privada do curso do usuário (ex: ['room_es'])
    """
    try:
        user = await get_user_by_id(user_id)
        if not user:
            return []

        course_id = user.get('course_id')
        if not course_id:
            return []

        # Retorna a room correspondente ao curso do usuário
        room_id = COURSE_TO_ROOM.get(course_id)
        if room_id:
            return [room_id]
        return []
    except Exception as e:
        print(f'Erro ao buscar rooms privadas do usuário {user_id}:', e)
        return []


async def check_room_access(user_id: str, room_id: str):
    """
    Verifica se o usuário tem acesso a uma room específica

    Regras:
    - Chat geral (room_general): todos os autenticados têm acesso
    - Rooms privadas (room_es, room_cd): apenas usuários do curso correspondente
    - Outras rooms: sempre permitido (chats normais)

    Args:
        user_id: ID do usuário
        room_id: ID da room

    Returns:
        True se o usuário tem acesso, False caso contrário
    """
    # Chat geral é acessível a todos os usuários autenticados
    if room_id == GENERAL_ROOM:
        return True

    # Rooms normais (chats) não precisam dessa verificação
    if room_id not in PRIVATE_ROOMS:
        return True

    # Verifica acesso a rooms privadas baseado no course_id
    try:
        user = await get_user_by_id(user_id)
        if not user:
            return False

        course_id = user.get('course_id')
        if not course_id:
            return False

        # Verifica se o curso do usuário corresponde à room
        user_room = COURSE_TO_ROOM.get(course_id)
        return user_room == room_id
    except Exception as e:
        print(f'Erro ao verificar acesso à room {room_id} para usuário {user_id}:', e)
        return False


def is_valid_room(room_id: str):
    """
    Verifica se o room_id é uma room válida do sistema

    Args:
        room_id: ID da room

    Returns:
        True se é uma room válida (geral ou privada)
    """
    return room_id == GENERAL_ROOM or room_id in PRIVATE_ROOMS
