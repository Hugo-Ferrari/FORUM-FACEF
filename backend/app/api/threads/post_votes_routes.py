from fastapi import APIRouter, HTTPException, Header

from ...api.threads.querys.posts_vote_query import (
    create_post_vote,
    get_post_votes,
    get_user_post_votes,
    delete_post_vote
)
from ...models.post_votes_types import PostsVotesCreateRequest

router = APIRouter()


@router.post("/", status_code=201)
async def vote_on_post(
    data: PostsVotesCreateRequest,
    user_id: str = Header(..., alias="user-id")
):
    """
    Cria ou atualiza um voto em um post.

    - **post_id**: ID do post a ser votado
    - **vote_type**: Tipo de voto ("upvote" ou "downvote")

    Se o usuário já votou, o voto será atualizado.
    """
    print(f"LOG: POST VOTE CREATION ATTEMPTED BY USER {user_id}")
    print(data)
    try:
        res = await create_post_vote(data, user_id)
        if res:
            return {"message": "Voto registrado com sucesso!", "success": True}
        raise HTTPException(status_code=400, detail="Erro ao registrar voto")

    except HTTPException:
        raise
    except Exception as e:
        print(f"ERROR: {e}")
        raise HTTPException(status_code=500, detail=f"Erro interno ao registrar voto: {str(e)}")


@router.get("/post/{post_id}")
async def get_votes_for_post(post_id: str):
    """
    Retorna todos os votos de um post específico.

    - **post_id**: ID do post
    """
    print(f"LOG: GET VOTES FOR POST {post_id}")
    try:
        votes = await get_post_votes(post_id)

        # Calcula estatísticas dos votos
        upvotes = sum(1 for vote in votes if vote.vote_type == 'upvote')
        downvotes = sum(1 for vote in votes if vote.vote_type == 'downvote')
        total = upvotes - downvotes

        return {
            "votes": votes,
            "statistics": {
                "upvotes": upvotes,
                "downvotes": downvotes,
                "total": total
            }
        }
    except Exception as e:
        print(f"ERROR: {e}")
        raise HTTPException(status_code=500, detail=f"Erro ao buscar votos do post: {str(e)}")


@router.get("/user/me")
async def get_my_votes(user_id: str = Header(..., alias="user-id")):
    """
    Retorna todos os votos do usuário autenticado.
    """
    print(f"LOG: GET VOTES FOR USER {user_id}")
    try:
        votes = await get_user_post_votes(user_id)
        return {"votes": votes if votes else []}
    except Exception as e:
        print(f"ERROR: {e}")
        raise HTTPException(status_code=500, detail=f"Erro ao buscar votos do usuário: {str(e)}")


@router.delete("/{post_id}", status_code=200)
async def remove_vote(
    post_id: str,
    user_id: str = Header(..., alias="user-id")
):
    """
    Remove o voto do usuário em um post específico.

    - **post_id**: ID do post
    """
    print(f"LOG: DELETE VOTE ON POST {post_id} BY USER {user_id}")
    try:
        res = await delete_post_vote(post_id, user_id)
        if res:
            return {"message": "Voto removido com sucesso!", "success": True}
        raise HTTPException(status_code=400, detail="Erro ao remover voto")

    except HTTPException:
        raise
    except Exception as e:
        print(f"ERROR: {e}")
        raise HTTPException(status_code=500, detail=f"Erro ao remover voto: {str(e)}")
