from ....database.supabase_client import supabase
from ....models.threads_type import ThreadsType

async def create_thread(data: ThreadsType, user_id: str) -> bool:
    print("LOG: THREAD CREATION ATTEMPTED")
    try:
        user_data = supabase.table('users').select('course_id, course_year').eq("id", user_id).execute().data[0]
        course_id = user_data.get('course_id')
        course_year = user_data.get('course_year')
        print("LOG: COURSE_ID AND COURSE_YEAR SUCCESSFULLY RETRIEVED")
        print(course_id, course_year)

        # Converte o objeto Pydantic para dict e adiciona os campos
        thread_data = data.model_dump(exclude_unset=True)
        thread_data['course_id'] = course_id
        thread_data['year'] = course_year
        thread_data['created_by'] = user_id

        print(thread_data)
        try:
            supabase.table('threads').insert(thread_data).execute()
            print("LOG: THREAD CREATED SUCCESSFULLY")
            return True

        except Exception as e:
            print(f"LOG: ERROR CREATING THREAD: {e}")
            return False

    except Exception as e:
        print(f"LOG: ERROR RETRIEVING COURSE ID: {e}")
        return False


async def get_threads_by_course(course_id: str) -> list[ThreadsType]:
    print(f"LOG: GET THREADS BY COURSE {course_id}")
    try:
        data: list[ThreadsType] = supabase.table('threads').select('*').eq('course_id', course_id).execute().data
        return data
    except Exception as e:
        print(f"Erro ao pegar threads do curso {course_id}: {e}")
        return []


async def get_thread_by_id(thread_id: str) -> ThreadsType | None:
    print(f"LOG: GET THREAD BY ID {thread_id}")
    try:
        data: ThreadsType = supabase.table('threads').select('*').eq('id', thread_id).execute().data[0]
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