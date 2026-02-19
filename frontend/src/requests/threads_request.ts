import axios from "axios"

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

const api = axios.create({
  baseURL: API_BASE,
})

export interface ThreadResponse {
  id: string
  title: string
  content: string
  course_id: string
  is_anonymous: boolean
  created_by: string
  created_at: string
  updated_at: string | null
  year: number
  posts: number
}

export const req_threads = async (title: string,content: string,course_id: string,is_anonymous: boolean): Promise<ThreadResponse> => {
  try {
    const res = await api.post<ThreadResponse>(
      "/api/threads",
      {
        title,
        content,
        course_id,
        is_anonymous,
      }
    )

    return res.data
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        "Erro ao criar thread"
    )
  }
}

export const getThreadsByCourse = async (course_id: string): Promise<ThreadResponse[]> => {
  try {
    const res = await api.get<ThreadResponse[]>(
      `/api/threads/course/${course_id}`
    )

    return res.data
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        "Erro ao listar threads"
    )
  }
}
export const getThreadById = async (thread_id: string): Promise<ThreadResponse> => {
  try {
    const res = await api.get<ThreadResponse>(
      `/api/threads/${thread_id}`
    )

    return res.data
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        "Erro ao buscar thread"
    )
  }
}

