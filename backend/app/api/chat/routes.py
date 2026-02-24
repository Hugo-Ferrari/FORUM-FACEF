from fastapi import APIRouter, HTTPException, Header

from ...auth.user_querys import check_token
from ...database.supabase_client import supabase

router = APIRouter()


@router.get('/')
async def list_chats(authorization: str = Header(...)):
    """Retorna lista de chats que o usuário participa"""
    token = authorization.replace("Bearer ", "").strip()
    user_id = await check_token(token)

    try:
        # Busca o usuário
        user_data = supabase.table('users').select('course_id').eq('id', user_id).execute().data[0]
        course_id = user_data['course_id']
        print(f"LIST User course_id: {course_id}")

        # Busca os chats do curso (res.data já é uma lista)
        res = supabase.table('chats').select('id, name, is_general').eq('course_id', course_id).execute()
        print(f"LIST Chats encontrados: {res.data}")

        # res.data já é a lista de chats
        chats = res.data if res.data else []
        return {'chats': chats}
    except Exception as e:
        print(f"Erro ao listar chats: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get('/{chat_id}/messages')
async def get_chat_messages(chat_id: str):
    """Retorna mensagens do chat ordenadas por timestamp asc"""
    try:
        res = supabase.table('messages').select('*').eq('chat_id', chat_id).order('created_at', asc=True).execute()
        return {'messages': res.data if res.data else []}
    except Exception as e:
        print(f"Erro ao buscar mensagens: {e}")
        raise HTTPException(status_code=500, detail=str(e))

