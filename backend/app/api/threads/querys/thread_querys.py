from .posts_querys import get_posts_by_thread_id
from ....database.supabase_client import supabase
from ....models.post_type import PostTypeResponse
from ....models.threads_type import ThreadsType, ThreadsResponse, ThreadResponse


async def create_thread(data: ThreadsType, user_id: str) -> bool:
    print("LOG: THREAD CREATION ATTEMPTED")

    try:
        # Busca dados do usuário com validação
        user_response = supabase.table('users').select('course_id, course_year').eq("id", user_id).execute()

        if not user_response.data:
            print(f"LOG: ERROR - User {user_id} not found")
            return False

        user_data = user_response.data[0]
        course_id = user_data.get('course_id')
        course_year = user_data.get('course_year')

        if not course_id:
            print("LOG: ERROR - User has no course_id")
            return False

        print("LOG: COURSE_ID AND COURSE_YEAR SUCCESSFULLY RETRIEVED")
        print(f"Course ID: {course_id}, Course Year: {course_year}")

        # Converte o objeto Pydantic para dict e adiciona os campos
        thread_data = data.model_dump(exclude_unset=True)
        thread_data['course_id'] = course_id
        thread_data['year'] = course_year
        thread_data['created_by'] = user_id

        print(f"Thread data to insert: {thread_data}")

        # Insere a thread no banco
        response = supabase.table('threads').insert(thread_data).execute()

        if response.data:
            print("LOG: THREAD CREATED SUCCESSFULLY")
            return True
        else:
            print("LOG: ERROR - No data returned from insert")
            return False

    except Exception as e:
        print(f"LOG: ERROR CREATING THREAD: {e}")
        return False

async def get_threads_by_course(course_id: str) -> list[ThreadsResponse]:
    print(f"LOG: GET THREADS BY COURSE {course_id}")
    try:
        res_data: list[ThreadsType] = supabase.table('threads').select('*').eq('course_id', course_id).execute().data
        data = []

        if res_data:
            for thread in res_data:
                # Verifica se a thread é anônima
                if thread.get("is_anonymous", False):
                    thread["created_by"] = "Anônimo"

                else:
                    # Busca o nome do usuário que criou a thread
                    created_by_response = supabase.table("users").select("name").eq("id", thread["created_by"]).execute()
                    if created_by_response.data:
                        thread["created_by"] = created_by_response.data[0]["name"]
                    else:
                        thread["created_by"] = "Usuário Desconhecido"

                # Conta os posts da thread
                count_response = supabase.table('posts').select('*').eq('thread_id', thread["id"]).execute()
                thread["posts"] = len(count_response.data) if count_response.data else 0

                data.append(ThreadsResponse(
                    id=thread["id"],
                    title=thread["title"],
                    content=thread["content"],
                    created_by=thread["created_by"],
                    year=thread["year"],
                    created_at=thread["created_at"],
                    posts=thread["posts"]
                ))

            return data
        return []
    except Exception as e:
        print(f"Erro ao pegar threads do curso {course_id}: {e}")
        return []

async def get_thread_by_id(thread_id: str, user_id: str = None) -> ThreadResponse | None:
    print(f"LOG: GET THREAD BY ID {thread_id}")
    try:
        thread_response = supabase.table('threads').select('*').eq('id', thread_id).execute()

        if not thread_response.data:
            print(f"LOG: Thread {thread_id} not found")
            return None

        res: ThreadsType = thread_response.data[0]

        # Guarda o ID original do criador para usar nas queries
        original_created_by_id = res["created_by"]

        # Verifica se a thread é anônima
        if res.get("is_anonymous", False):
            res["created_by"] = "Anônimo"
        else:
            # Busca o nome do usuário que criou a thread
            created_by_response = supabase.table("users").select("name").eq("id", original_created_by_id).execute()
            if created_by_response.data:
                res["created_by"] = created_by_response.data[0]["name"]
            else:
                res["created_by"] = "Usuário Desconecido"

        print(f"LOG: THREAD DATA: {res}")

        # Usa o user_id passado ou o ID original do criador da thread
        request_user_id = user_id if user_id else original_created_by_id

        answers: list[PostTypeResponse] = await get_posts_by_thread_id(thread_id, request_user_id)
        print(f"LOG: ANSWERS DATA: {answers}")

        res["posts"] = len(answers)

        thread: ThreadsResponse = ThreadsResponse(id=res["id"], title=res["title"], content=res["content"],
                        created_by=res["created_by"], year=res["year"], created_at=res["created_at"], posts=res["posts"])

        data: ThreadResponse = ThreadResponse(thread=thread, posts=answers)
        print(f"LOG: THREAD RESPONSE: {data}")
        return data

    except Exception as e:
        print(f"Erro ao pegar thread {thread_id}: {e}")
        return None

async def edit_thread_by_id(data: dict, thread_id: str) -> bool:
    print(f"LOG: Editando thread {thread_id}")
    try:
        supabase.table('threads').update(data).eq('id', thread_id).execute()
        print("LOG: THREAD EDITED SUCCESSFULLY")
        return True

    except Exception as e:
        print(f"Erro ao editar thread {thread_id}: {e}")
        return False


async def delete_thread_by_id(thread_id: str) -> bool:
    print(f"LOG: Deletando thread {thread_id}")
    try:
        supabase.table('threads').delete().eq('id', thread_id).execute()
        print("LOG: THREAD DELETED SUCCESSFULLY")
        return True

    except Exception as e:
        print(f"Erro ao deletar thread {thread_id}: {e}")
        return False