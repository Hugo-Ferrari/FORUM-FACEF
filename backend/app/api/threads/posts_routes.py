from fastapi import APIRouter, HTTPException, Header

from ...api.threads.querys.posts_querys import (
    create_post,
    get_post_by_id,
    edit_post_by_id,
    delete_post_by_id
)
from ...auth.user_querys import check_token
from ...models.post_type import PostCreateRequest, PostUpdateRequest

router = APIRouter()

@router.post("/", status_code=201)
async def create_new_post(
        data: PostCreateRequest,
        authorization: str = Header(...)
):
    token = authorization.replace("Bearer ", "").strip()
    user_id = await check_token(token)

    if not user_id:
        raise HTTPException(status_code=500, detail=f"Erro ao validar token: usuário não encontrado")

    print(f"LOG: POST CREATION ATTEMPTED BY USER {user_id}")
    print(data)
    try:
        res = await create_post(data, user_id)
        if res:
            return {"message": "Post criado com sucesso!", "success": True}
        raise HTTPException(status_code=400, detail="Erro ao criar post")

    except HTTPException:
        raise
    except Exception as e:
        print(f"ERROR: {e}")
        raise HTTPException(status_code=500, detail=f"Erro interno ao criar post: {str(e)}")


@router.get("/{post_id}")
async def get_post(post_id: str):
    """
    Retorna um post específico pelo ID.

    - **post_id**: ID do post
    """
    print(f"LOG: GET POST BY ID {post_id}")
    try:
        res = await get_post_by_id(post_id)
        if not res:
            raise HTTPException(status_code=404, detail="Post não encontrado")
        return res
    except HTTPException:
        raise
    except Exception as e:
        print(f"ERROR: {e}")
        raise HTTPException(status_code=500, detail=f"Erro ao buscar post: {str(e)}")


@router.patch("/{post_id}")
async def update_post(
    post_id: str,
    data: PostUpdateRequest,
    authorization: str = Header(...)
):
    """
    Atualiza um post existente.

    - **post_id**: ID do post a ser atualizado
    - **content**: Novo conteúdo do post
    - **is_anonymous**: Se o post é anônimo ou não
    """
    token = authorization.replace("Bearer ", "").strip()
    user_id = await check_token(token)

    if not user_id:
        raise HTTPException(status_code=500, detail=f"Erro ao validar token: usuário não encontrado")
    print(f"LOG: UPDATE POST {post_id} BY USER {user_id}")
    try:
        # Verifica se o post existe
        post = await get_post_by_id(post_id)
        if not post:
            raise HTTPException(status_code=404, detail="Post não encontrado")

        # Verifica permissão
        if post.created_by != user_id:
            raise HTTPException(status_code=403, detail="Sem permissão para editar este post")

        update_data = data.model_dump(exclude_unset=True)
        res = await edit_post_by_id(update_data, post_id)
        if res:
            return {"message": "Post atualizado com sucesso!", "success": True}
        raise HTTPException(status_code=400, detail="Erro ao atualizar post")

    except HTTPException:
        raise
    except Exception as e:
        print(f"ERROR: {e}")
        raise HTTPException(status_code=500, detail=f"Erro ao atualizar post: {str(e)}")


@router.delete("/{post_id}", status_code=200)
async def delete_post(
    post_id: str,
    authorization: str = Header(...)
):
    """
    Deleta um post existente.
    - **post_id**: ID do post a ser deletado
    """
    token = authorization.replace("Bearer ", "").strip()
    user_id = await check_token(token)

    if not user_id:
        raise HTTPException(status_code=500, detail=f"Erro ao validar token: usuário não encontrado")
    print(f"LOG: DELETE POST {post_id} BY USER {user_id}")
    try:
        # Verifica se o post existe
        post = await get_post_by_id(post_id)
        if not post:
            raise HTTPException(status_code=404, detail="Post não encontrado")

        # Verifica permissão
        if post.created_by != user_id:
            raise HTTPException(status_code=403, detail="Sem permissão para deletar este post")

        res = await delete_post_by_id(post_id)
        if res:
            return {"message": "Post deletado com sucesso!", "success": True}
        raise HTTPException(status_code=400, detail="Erro ao deletar post")

    except HTTPException:
        raise
    except Exception as e:
        print(f"ERROR: {e}")
        raise HTTPException(status_code=500, detail=f"Erro ao deletar post: {str(e)}")
