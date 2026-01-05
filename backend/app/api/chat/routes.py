from fastapi import APIRouter, HTTPException, Depends
from ..database.supabase_client import supabase

router = APIRouter()

# NOTE: This is a minimal example — adjust authentication and error handling to your app

@router.get('/chats')
async def list_chats(user_id: str):
    # retorna lista de chats que o usuário participa
    res = supabase.table('chats_members').select('chat_id').eq('user_id', user_id).execute()
    if res.status_code != 200:
        raise HTTPException(status_code=500, detail='db error')
    chat_ids = [r['chat_id'] for r in res.data]
    return {'chats': chat_ids}

@router.get('/chats/{chat_id}/messages')
async def get_chat_messages(chat_id: str):
    # retorna mensagens do chat ordenadas por timestamp asc
    res = supabase.table('messages').select('*').eq('chat_id', chat_id).order('created_at', asc=True).execute()
    if res.status_code != 200:
        raise HTTPException(status_code=500, detail='db error')
    return {'messages': res.data}

