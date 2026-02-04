from .posts_vote_query import get_post_votes
from ....database.supabase_client import supabase
from ....models.post_type import PostCreateRequest, PostTypeResponse


async def create_post(data: PostCreateRequest, user_id: str) -> bool:
    print("LOG: POST CREATION ATTEMPTED")

    post_data = data.model_dump(exclude_unset=True)
    post_data['created_by'] = user_id
    print(f"LOG: POST DATA: {post_data}")
    try:
        supabase.table('posts').insert(post_data).execute()
        print("LOG: POST CREATED SUCCESSFULLY")
        return True

    except Exception as e:
        print(f"Erro ao criar post: {e}")
        return False


async def get_post_by_id(post_id: str) -> PostTypeResponse | None:
    print(f"LOG: GET POST BY ID {post_id}")

    try:
        result = supabase.table('posts').select('*').eq('id', post_id).execute()

        if not result.data or len(result.data) == 0:
            print("LOG: NO POST FOUND")
            return None

        post_data = result.data[0]

        # Busca os votos do post
        try:
            votes_result = await get_post_votes(post_id)
            votes = votes_result if votes_result else []

            post_data['votes'] = votes
            print(f"LOG: POST RETURNED WITH {len(votes)} VOTES")

        except Exception as e:
            print(f"Erro ao pegar post_votes do post {post_id}: {e}")
            post_data['votes'] = []

        # Cria a resposta usando o modelo
        response = PostTypeResponse(**post_data)
        return response

    except Exception as e:
        print(f"Erro ao pegar post {post_id}: {e}")
        return None


async def get_posts_by_thread_id(thread_id: str) -> list[PostTypeResponse]:
    print(f"LOG: GET POSTS BY THREAD ID {thread_id}")
    try:
        result = supabase.table('posts').select('*').eq('thread_id', thread_id).execute()

        if not result.data:
            print("LOG: NO POSTS FOUND")
            return []

        posts = []
        for post_data in result.data:
            # Busca votos para cada post
            try:
                votes_result = await get_post_votes(post_data['id'])
                post_data['votes'] = votes_result if votes_result else []
            except Exception as e:
                print(f"Erro ao pegar votos do post {post_data['id']}: {e}")
                post_data['votes'] = []

            posts.append(PostTypeResponse(**post_data))

        print(f"LOG: {len(posts)} POSTS RETURNED")
        return posts

    except Exception as e:
        print(f"Erro ao pegar posts do thread {thread_id}: {e}")
        return []

async def edit_post_by_id(data: dict, post_id: str) -> bool:
    print("LOG: POST EDIT ATTEMPTED")

    try:
        supabase.table('posts').update(data).eq('id', post_id).execute()
        print("LOG: POST EDITED SUCCESSFULLY")
        return True
    except Exception as e:
        print(f"Erro ao editar post {post_id}: {e}")
        return False


async def delete_post_by_id(post_id: str) -> bool:
    print("LOG: POST DELETION ATTEMPTED")

    try:
        supabase.table('posts').delete().eq('id', post_id).execute()
        print("LOG: POST DELETED SUCCESSFULLY")
        return True
    except Exception as e:
        print(f"Erro ao deletar post {post_id}: {e}")
        return False