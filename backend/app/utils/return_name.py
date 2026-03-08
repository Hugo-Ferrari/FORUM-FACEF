from ..database.supabase_client import supabase


async def return_name(user_id: str) -> str:
    try:
        result = supabase.table('users').select('name').eq('id', user_id).execute().data
        if result and len(result) > 0:
            print(f"LOG: User name found for user_id {user_id}: {result[0]['name']}")
            return result[0]['name']
        else:
            return "Unknown User"
    except Exception as e:
        print(f"Erro ao pegar nome do usuário {user_id}: {e}")
        return "Unknown User"