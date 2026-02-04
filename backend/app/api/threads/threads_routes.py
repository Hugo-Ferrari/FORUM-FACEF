from fastapi import APIRouter, HTTPException, Header

from .querys.thread_querys import (
    create_thread,
    get_threads_by_course,
    get_thread_by_id,
    edit_thread_by_id,
    delete_thread_by_id
)
from ...models.threads_type import ThreadsType
from .posts_routes import router as posts_router
from .post_votes_routes import router as post_votes_router

router = APIRouter()
router.include_router(posts_router, prefix="/posts", tags=["Posts"])
router.include_router(post_votes_router, prefix="/votes", tags=["Post Votes"])


@router.post("/", status_code=201)
async def create_new_thread(
    data: ThreadsType,
    user_id: str = Header(..., alias="user-id")
):
    """
    Cria uma nova thread no fórum.

    - **title**: Título da thread
    - **content**: Conteúdo da thread
    - **is_anonymous**: Se a thread é anônima ou não
    """
    print(f"LOG: THREAD CREATION ATTEMPTED BY USER {user_id}")
    print(data)
    try:
        res = await create_thread(data, user_id)
        if res:
            return {"message": "Thread criada com sucesso!", "success": True}
        raise HTTPException(status_code=400, detail="Erro ao criar thread")

    except HTTPException:
        raise
    except Exception as e:
        print(f"ERROR: {e}")
        raise HTTPException(status_code=500, detail=f"Erro interno ao criar thread: {str(e)}")


@router.get("/course/{course_id}")
async def get_course_threads(course_id: str):
    """
    Retorna todas as threads de um curso específico.

    - **course_id**: ID do curso
    """
    print(f"LOG: GET THREADS BY COURSE {course_id}")
    try:
        threads = await get_threads_by_course(course_id)
        return {"threads": threads, "count": len(threads)}
    except Exception as e:
        print(f"ERROR: {e}")
        raise HTTPException(status_code=500, detail=f"Erro ao buscar threads do curso: {str(e)}")


@router.get("/{thread_id}")
async def get_thread(thread_id: str):
    """
    Retorna uma thread específica pelo ID.

    - **thread_id**: ID da thread
    """
    print(f"LOG: GET THREAD BY ID {thread_id}")
    try:
        thread = await get_thread_by_id(thread_id)
        if not thread:
            raise HTTPException(status_code=404, detail="Thread não encontrada")
        return thread
    except HTTPException:
        raise
    except Exception as e:
        print(f"ERROR: {e}")
        raise HTTPException(status_code=500, detail=f"Erro ao buscar thread: {str(e)}")


@router.patch("/{thread_id}")
async def update_thread(
    thread_id: str,
    data: dict,
    user_id: str = Header(..., alias="user-id")
):
    """
    Atualiza uma thread existente.

    - **thread_id**: ID da thread a ser atualizada
    - **data**: Dados a serem atualizados (title, content, etc.)
    """
    print(f"LOG: UPDATE THREAD {thread_id} BY USER {user_id}")
    try:
        # Verifica se a thread existe e se o usuário é o criador
        thread = await get_thread_by_id(thread_id)
        if not thread:
            raise HTTPException(status_code=404, detail="Thread não encontrada")

        # Verifica permissão (opcional - descomente se quiser validar)
        # if thread.get('created_by') != user_id:
        #     raise HTTPException(status_code=403, detail="Sem permissão para editar esta thread")

        res = await edit_thread_by_id(data, thread_id)
        if res:
            return {"message": "Thread atualizada com sucesso!", "success": True}
        raise HTTPException(status_code=400, detail="Erro ao atualizar thread")

    except HTTPException:
        raise
    except Exception as e:
        print(f"ERROR: {e}")
        raise HTTPException(status_code=500, detail=f"Erro ao atualizar thread: {str(e)}")


@router.delete("/{thread_id}", status_code=200)
async def delete_thread(
    thread_id: str,
    user_id: str = Header(..., alias="user-id")
):
    """
    Deleta uma thread existente.

    - **thread_id**: ID da thread a ser deletada
    """
    print(f"LOG: DELETE THREAD {thread_id} BY USER {user_id}")
    try:
        # Verifica se a thread existe
        thread = await get_thread_by_id(thread_id)
        if not thread:
            raise HTTPException(status_code=404, detail="Thread não encontrada")

        # Verifica permissão (opcional - descomente se quiser validar)
        # if thread.get('created_by') != user_id:
        #     raise HTTPException(status_code=403, detail="Sem permissão para deletar esta thread")

        res = await delete_thread_by_id(thread_id)
        if res:
            return {"message": "Thread deletada com sucesso!", "success": True}
        raise HTTPException(status_code=400, detail="Erro ao deletar thread")

    except HTTPException:
        raise
    except Exception as e:
        print(f"ERROR: {e}")
        raise HTTPException(status_code=500, detail=f"Erro ao deletar thread: {str(e)}")
