from ....database.supabase_client import supabase
from ....models.post_votes_types import PostsVotesCreateRequest, PostsVotesType

async def create_post_vote(data: PostsVotesCreateRequest, user_id: str) -> bool:
    print("LOG: POST VOTE CREATION ATTEMPTED")
    print(f"LOG: USER: {user_id}, POST: {data.post_id}, VOTE TYPE: {data.vote_type}")

    post_vote_data = data.model_dump(exclude_unset=True)
    post_vote_data['user_id'] = user_id

    print(f"LOG: CHECKING IF USER ALREADY VOTED FOR POST {post_vote_data['post_id']}")
    try:
        # Verifica se o usuário já votou neste post específico
        existing_vote = supabase.table('posts_votes')\
            .select('*')\
            .eq('post_id', post_vote_data['post_id'])\
            .eq('user_id', user_id)\
            .execute()

        print(f"LOG: EXISTING VOTES QUERY RESULT: {existing_vote.data}")

        if existing_vote.data and len(existing_vote.data) > 0:
            old_vote = existing_vote.data[0]
            print(f"LOG: USER ALREADY VOTED ON THIS POST - OLD VOTE: {old_vote['vote_type']}")
            print(f"LOG: DELETING OLD VOTE ID: {old_vote['id']}")

            try:
                await delete_post_vote(post_vote_data['post_id'], user_id)
                print("LOG: OLD VOTE DELETED SUCCESSFULLY")

            except Exception as e:
                print(f"LOG: ERROR DELETING OLD VOTE: {e}")
                return False
        else:
            print("LOG: NO PREVIOUS VOTE FOUND FOR THIS POST - CREATING NEW VOTE")

    except Exception as e:
        print(f"LOG: ERROR CHECKING USER VOTE: {e}")
        return False


    print(f"LOG: CREATING NEW VOTE - POST: {post_vote_data['post_id']}, USER: {user_id}, TYPE: {post_vote_data['vote_type']}")
    try:
        result = supabase.table('posts_votes').insert(post_vote_data).execute()
        print(f"LOG: POST VOTE CREATED SUCCESSFULLY - RESULT: {result.data}")
        return True
    except Exception as e:
        print(f"LOG: ERROR CREATING POST_VOTE: {e}")
        return False


async def get_user_post_votes(user_id: str) -> list[PostsVotesType]:
    print(f"LOG: GET USER POST VOTES FOR USER {user_id}")

    try:
        result = supabase.table('posts_votes').select('*').eq('user_id', user_id).execute()

        if result.data:
            votes = [PostsVotesType(**vote) for vote in result.data]
            print(f"LOG: {len(votes)} USER POST VOTES RETURNED")
            return votes

        print("LOG: NO VOTES FOUND FOR USER")
        return []

    except Exception as e:
        print(f"Erro ao pegar post_votes do user {user_id}: {e}")
        return []


async def get_user_post_id_vote(user_id: str, post_id: str) -> PostsVotesType | None:
    print(f"LOG: GET USER POST VOTE FOR USER {user_id} AND POST {post_id}")

    try:
        result = supabase.table('posts_votes').select('*').eq('user_id', user_id).eq('post_id', post_id).execute()

        if result.data and len(result.data) > 0:
            vote = PostsVotesType(**result.data[0])
            print("LOG: USER POST VOTE RETURNED")
            return vote

        print("LOG: NO VOTE FOUND FOR USER AND POST")
        return None

    except Exception as e:
        print(f"Erro ao pegar post_vote do user {user_id} e post {post_id}: {e}")
        return None


async def get_post_votes(post_id: str) -> list[PostsVotesType]:
    print(f"LOG: GET POST VOTES FOR POST {post_id}")

    try:
        result = supabase.table('posts_votes').select('*').eq('post_id', post_id).execute()

        if result:
            votes = [PostsVotesType(**vote) for vote in result.data]
            print(f"LOG: {len(votes)} POST VOTES RETURNED")
            return votes

        print("LOG: NO VOTES FOUND FOR POST")
        return []

    except Exception as e:
        print(f"Erro ao pegar post_votes do post {post_id}: {e}")
        return []


async def delete_post_vote(post_id: str, user_id: str) -> bool:
    print(f"LOG: POST VOTE DELETION ATTEMPTED - POST: {post_id}, USER: {user_id}")
    try:
        result = supabase.table('posts_votes')\
            .delete()\
            .eq('post_id', post_id)\
            .eq('user_id', user_id)\
            .execute()

        print(f"LOG: POST VOTE DELETED SUCCESSFULLY - DELETED COUNT: {len(result.data) if result.data else 0}")
        return True
    except Exception as e:
        print(f"LOG: ERROR DELETING POST_VOTE - POST: {post_id}, USER: {user_id}, ERROR: {e}")
        return False