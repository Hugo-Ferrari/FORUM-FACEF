import axios from "axios"
import { getCookie } from "cookies-next"
import {Thread} from "@/store/threads_store";
import { threadId } from "worker_threads";

const token = getCookie("token")

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    Authorization: `Bearer ${token}`
  }
})

export interface ThreadResponse {
  threads: Thread[],
  count: number
}

export const req_create_threads = async (title: string,content: string,course_id: string,is_anonymous: boolean): Promise<void> => {
  try {
    const res = await api.post(
      "/api/threads",
      {
        title,
        content,
        course_id,
        is_anonymous,
      }
    )

    if(res.data.success) {
      console.log("Successfully created thread")
    }

  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
      "Erro ao criar thread"
    )
  }
}

export const req_get_thread_by_course_id = async (course_id: string): Promise<ThreadResponse> => {
  try {
    const res = await api.get<ThreadResponse>(
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
export const req_get_thread_by_id = async (thread_id: string): Promise<ThreadResponse> => {
  try {
    const res = await api.get<ThreadResponse>(`/api/threads/${thread_id}`)

    return res.data
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        "Erro ao buscar thread"
    )
  }
}

