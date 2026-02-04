from ....database.supabase_client import supabase
from ....models.post_type import PostType


async def get_posts_by_thread_id(thread_id: str) -> list[PostType]:
    print(f"LOG: GET POSTS BY THREAD ID {thread_id}")
    try:
        data: list[PostType] = supabase.table('posts').select('*').eq('thread_id', thread_id).execute().data
        if data:
            print(f"LOG: POSTS RETURNED: {data}")
            return data

        print("LOG: NO POST FOUND")
        return []

    except Exception as e:
        print(f"Erro ao pegar posts do thread {thread_id}: {e}")
        return []

