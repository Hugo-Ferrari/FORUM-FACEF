from ....database.supabase_client import supabase
from ....models.post_votes_types import PostsVotesCreateRequest, PostsVotesType

async def create_post_vote(data: PostsVotesCreateRequest, user_id: str) -> bool:
    print("LOG: POST VOTE CREATION ATTEMPTED")
    post_vote_data = data.model_dump(exclude_unset=True)
    post_vote_data['user_id'] = user_id

    print(f"LOG: CHECKING THE USER VOTE FOR POST {post_vote_data['post_id']}")
    try:
        # Verifica se o usuário já votou neste post
        existing_vote = supabase.table('posts_votes')\
            .select('*')\
            .eq('post_id', post_vote_data['post_id'])\
            .eq('user_id', user_id)\
            .execute()

        if existing_vote.data and len(existing_vote.data) > 0:
            print("LOG: USER HAS ALREADY VOTED FOR THIS POST - DELETING OLD VOTE")
            try:
                await delete_post_vote(post_vote_data['post_id'], user_id)
            except Exception as e:
                print(f"LOG: ERROR DELETING OLD VOTE: {e}")

    except Exception as e:
        print(f"LOG: ERROR CHECKING USER VOTE: {e}")


    print("LOG: POST VOTE CREATION")
    try:
        supabase.table('posts_votes').insert(post_vote_data).execute()
        print("LOG: POST VOTE CREATED SUCCESSFULLY")
        return True
    except Exception as e:
        print(f"Erro ao criar post_vote: {e}")
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


async def get_post_votes(post_id: str) -> list[PostsVotesType]:
    print(f"LOG: GET POST VOTES FOR POST {post_id}")

    try:
        result = supabase.table('posts_votes').select('*').eq('post_id', post_id).execute()

        if result.data:
            votes = [PostsVotesType(**vote) for vote in result.data]
            print(f"LOG: {len(votes)} POST VOTES RETURNED")
            return votes

        print("LOG: NO VOTES FOUND FOR POST")
        return []

    except Exception as e:
        print(f"Erro ao pegar post_votes do post {post_id}: {e}")
        return []


async def delete_post_vote(post_id: str, user_id: str) -> bool:
    print("LOG: POST VOTE DELETION ATTEMPTED")
    try:
        supabase.table('posts_votes').delete().eq('post_id', post_id).eq('user_id', user_id).execute()
        print("LOG: POST VOTE DELETED SUCCESSFULLY")
        return True
    except Exception as e:
        print(f"Erro ao deletar post_vote do post {post_id}: {e}")
        return False