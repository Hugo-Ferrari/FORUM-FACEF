from fastapi import APIRouter, HTTPException, Header
from ...database.supabase_client import supabase


from .querys.thread_querys import (
    create_thread,
    get_threads_by_course,
    get_thread_by_id,
    edit_thread_by_id,
    delete_thread_by_id
)
from ...auth.user_querys import check_token
from ...models.threads_type import ThreadsType, ThreadCreateRequest
from .posts_routes import router as posts_router
from .post_votes_routes import router as post_votes_router

router = APIRouter()
router.include_router(posts_router, prefix="/posts", tags=["Posts"])
router.include_router(post_votes_router, prefix="/votes", tags=["Post Votes"])


@router.post("/", status_code=201, tags=["Threads"])
async def create_new_thread(
    data: ThreadCreateRequest,
    authorization: str = Header(..., description="JWT token no formato 'Bearer <token>'")
):
    """
    Cria uma nova thread no fórum.

    - **title**: Título da thread (obrigatório, 1-200 caracteres)
    - **content**: Conteúdo da thread (obrigatório)
    - **is_anonymous**: Se a thread deve ser anônima (opcional, padrão: false)

    O course_id e year são automaticamente preenchidos com base no usuário autenticado.
    """
    # Validação e extração do token
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Formato de token inválido. Use 'Bearer <token>'")

    token = authorization.replace("Bearer ", "").strip()

    if not token:
        raise HTTPException(status_code=401, detail="Token JWT ausente")

    # Validação do token e obtenção do user_id
    user_id = await check_token(token)

    if not user_id:
        raise HTTPException(status_code=401, detail="Token inválido ou expirado")

    print(f"LOG: THREAD CREATION ATTEMPTED BY USER {user_id}")
    print(f"Thread data: {data.model_dump()}")

    try:
        # Converte o modelo de request para o modelo completo
        thread_data = ThreadsType(
            title=data.title,
            content=data.content,
            is_anonymous=data.is_anonymous
        )

        res = await create_thread(thread_data, user_id)
        if res:
            return {
                "message": "Thread criada com sucesso!",
                "success": True,
                "data": {
                    "title": data.title,
                    "is_anonymous": data.is_anonymous
                }
            }
        raise HTTPException(status_code=500, detail="Erro interno ao criar thread - verifique se você possui um curso associado")

    except HTTPException:
        raise
    except Exception as e:
        print(f"ERROR: {e}")
        raise HTTPException(status_code=500, detail=f"Erro interno do servidor: {str(e)}")


@router.get("/course", tags=["Threads"])
async def get_my_course_threads(
    authorization: str = Header(..., description="JWT token no formato 'Bearer <token>'")
):
    """
    Retorna todas as threads do curso do usuário autenticado.

    Busca automaticamente o course_id do usuário logado e retorna as threads correspondentes.
    Requer autenticação válida.
    """
    # Validação e extração do token
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Formato de token inválido. Use 'Bearer <token>'")

    token = authorization.replace("Bearer ", "").strip()
    if not token:
        raise HTTPException(status_code=401, detail="Token JWT ausente")

    user_id = await check_token(token)

    if not user_id:
        raise HTTPException(status_code=401, detail="Token inválido ou expirado")

    # Busca o course_id do usuário
    user_course_result = supabase.table("users").select("course_id").eq("id", user_id).execute()
    if not user_course_result.data or not user_course_result.data[0].get("course_id"):
        raise HTTPException(status_code=404, detail="Usuário não possui curso associado")

    course_id = user_course_result.data[0]["course_id"]

    print(f"LOG: GET THREADS BY COURSE {course_id} BY USER {user_id}")
    try:
        threads = await get_threads_by_course(course_id)
        return {"threads": threads, "count": len(threads)}
    except Exception as e:
        print(f"ERROR: {e}")
        raise HTTPException(status_code=500, detail=f"Erro ao buscar threads do curso: {str(e)}")


@router.get("/course/{course_id}", tags=["Threads"])
async def get_threads_by_specific_course(
    course_id: str,
    authorization: str = Header(..., description="JWT token no formato 'Bearer <token>'")
):
    """
    Retorna todas as threads de um curso específico pelo course_id.

    - **course_id**: ID do curso específico

    Requer autenticação válida.
    """
    # Validação e extração do token
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Formato de token inválido. Use 'Bearer <token>'")

    token = authorization.replace("Bearer ", "").strip()
    if not token:
        raise HTTPException(status_code=401, detail="Token JWT ausente")

    user_id = await check_token(token)

    if not user_id:
        raise HTTPException(status_code=401, detail="Token inválido ou expirado")

    print(f"LOG: GET THREADS BY SPECIFIC COURSE {course_id} BY USER {user_id}")
    try:
        threads = await get_threads_by_course(course_id)
        return {"threads": threads, "count": len(threads)}
    except Exception as e:
        print(f"ERROR: {e}")
        raise HTTPException(status_code=500, detail=f"Erro ao buscar threads do curso: {str(e)}")


@router.get("/{thread_id}", tags=["Threads"])
async def get_thread(
    thread_id: str,
    authorization: str = Header(..., description="JWT token no formato 'Bearer <token>'")
):
    """
    Busca uma thread específica por ID.

    - **thread_id**: ID da thread a ser buscada

    Retorna a thread com todos os posts associados.
    """
    # Validação e extração do token
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Formato de token inválido. Use 'Bearer <token>'")

    token = authorization.replace("Bearer ", "").strip()
    if not token:
        raise HTTPException(status_code=401, detail="Token JWT ausente")

    user_id = await check_token(token)

    if not user_id:
        raise HTTPException(status_code=401, detail="Token inválido ou expirado")

    print(f"LOG: GET THREAD BY ID {thread_id} BY USER {user_id}")

    try:
        thread = await get_thread_by_id(thread_id, user_id)
        if not thread:
            raise HTTPException(status_code=404, detail="Thread não encontrada")
        return thread
    except HTTPException:
        raise
    except Exception as e:
        print(f"ERROR: {e}")
        raise HTTPException(status_code=500, detail=f"Erro interno ao buscar thread: {str(e)}")


@router.patch("/{thread_id}", tags=["Threads"])
async def update_thread(
    thread_id: str,
    data: ThreadCreateRequest,
    authorization: str = Header(..., description="JWT token no formato 'Bearer <token>'")
):
    """
    Atualiza uma thread existente.

    - **thread_id**: ID da thread a ser atualizada
    - **data**: Dados a serem atualizados (title, content, is_anonymous)

    Apenas o criador da thread pode editá-la.
    """
    # Validação e extração do token
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Formato de token inválido. Use 'Bearer <token>'")

    token = authorization.replace("Bearer ", "").strip()
    if not token:
        raise HTTPException(status_code=401, detail="Token JWT ausente")

    user_id = await check_token(token)

    if not user_id:
        raise HTTPException(status_code=401, detail="Token inválido ou expirado")

    print(f"LOG: UPDATE THREAD {thread_id} BY USER {user_id}")
    try:
        # Verifica se a thread existe e se o usuário é o criador
        thread = await get_thread_by_id(thread_id, user_id)
        if not thread:
            raise HTTPException(status_code=404, detail="Thread não encontrada")

        # Converte para dict apenas os campos que podem ser atualizados
        update_data = data.model_dump(exclude_unset=True)

        res = await edit_thread_by_id(update_data, thread_id)
        if res:
            return {"message": "Thread atualizada com sucesso!", "success": True}
        raise HTTPException(status_code=400, detail="Erro ao atualizar thread")

    except HTTPException:
        raise
    except Exception as e:
        print(f"ERROR: {e}")
        raise HTTPException(status_code=500, detail=f"Erro interno ao atualizar thread: {str(e)}")


@router.delete("/{thread_id}", status_code=200, tags=["Threads"])
async def delete_thread(
    thread_id: str,
    authorization: str = Header(..., description="JWT token no formato 'Bearer <token>'")
):
    """
    Deleta uma thread existente.

    - **thread_id**: ID da thread a ser deletada

    Apenas o criador da thread pode deletá-la (validação comentada por enquanto).
    """
    # Validação e extração do token
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Formato de token inválido. Use 'Bearer <token>'")

    token = authorization.replace("Bearer ", "").strip()
    if not token:
        raise HTTPException(status_code=401, detail="Token JWT ausente")

    user_id = await check_token(token)

    if not user_id:
        raise HTTPException(status_code=401, detail="Token inválido ou expirado")

    print(f"LOG: DELETE THREAD {thread_id} BY USER {user_id}")
    try:
        # Verifica se a thread existe
        thread = await get_thread_by_id(thread_id, user_id)
        if not thread:
            raise HTTPException(status_code=404, detail="Thread não encontrada")

        # Verifica permissão (opcional - descomente se quiser validar)
        # if thread.thread.created_by != user_id:
        #     raise HTTPException(status_code=403, detail="Sem permissão para deletar esta thread")

        res = await delete_thread_by_id(thread_id)
        if res:
            return {"message": "Thread deletada com sucesso!", "success": True}
        raise HTTPException(status_code=400, detail="Erro ao deletar thread")

    except HTTPException:
        raise
    except Exception as e:
        print(f"ERROR: {e}")
        raise HTTPException(status_code=500, detail=f"Erro interno ao deletar thread: {str(e)}")
