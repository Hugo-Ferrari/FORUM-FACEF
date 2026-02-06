from .posts_vote_query import get_post_votes, get_user_post_id_vote
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
        print(f"LOG: POST DATA: {post_data}")

        # Busca os votos do post
        try:
            votes_result = await get_post_votes(post_id)
            user_vote = await get_user_post_id_vote(user_id=post_data['created_by'], post_id=post_id)
            votes = votes_result if votes_result else []

            # Calcula estatísticas dos votos
            upvotes = sum(1 for vote in votes if vote.vote_type == 'upvote')
            downvotes = sum(1 for vote in votes if vote.vote_type == 'downvote')
            total = upvotes - downvotes

            post_data['vote'] = user_vote  # Pode ser None ou um objeto PostsVotesType
            post_data['relevancy'] = total
            print(f"LOG: POST RETURNED WITH {len(votes)} VOTES")

        except Exception as e:
            print(f"Erro ao pegar post_votes do post {post_id}: {e}")
            post_data['vote'] = None  # None em vez de []
            post_data['relevancy'] = 0

        # Cria a resposta usando o modelo
        response = PostTypeResponse(**post_data)
        return response

    except Exception as e:
        print(f"Erro ao pegar post {post_id}: {e}")
        return None


async def get_posts_by_thread_id(thread_id: str, user_id: str) -> list[PostTypeResponse]:
    print(f"LOG: GET POSTS BY THREAD ID {thread_id}")
    try:
        result = supabase.table('posts').select('*').eq('thread_id', thread_id).execute().data
        print(f"LOG: POSTS DATA: {result}")

        if not result:
            print("LOG: NO POSTS FOUND")
            return []

        posts = []

        for post_data in result:
            # Cria estatísticas do post

            print(f"LOG: GET VOTES FOR POST {post_data['id']}")

            try:
                votes_result = await get_post_votes(post_data['id'])

                # Calcula estatísticas dos votos
                upvotes = sum(1 for vote in votes_result if vote.vote_type == 'upvote')
                downvotes = sum(1 for vote in votes_result if vote.vote_type == 'downvote')
                total = upvotes - downvotes
                print(f"LOG: ${total} VOTES FOR POST")

                post_data['relevancy'] = total

            except Exception as e:
                print(f"Erro ao pegar votos do post {post_data['id']}: {e}")
                post_data['relevancy'] = 0


            print(f"LOG: GET USER VOTE FOR POST {post_data['id']}")
            # Pega o voto do Usuario
            try:
                user_vote = await get_user_post_id_vote(user_id, post_data['id'])
                post_data['vote'] = user_vote  # Pode ser None ou um objeto PostsVotesType

            except Exception as e:
                print(f"Erro ao pegar user_vote do post {post_data['id']}: {e}")
                post_data['vote'] = None  # None em vez de []


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