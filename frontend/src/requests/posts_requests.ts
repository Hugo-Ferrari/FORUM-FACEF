import axios from "axios"
import { getCookie } from "cookies-next"


export interface Post {
  id: string
  thread_id: string
  content: string
  created_by: string
  created_at: string
  updated_at: string
  vote: number | null
  relevancy: number
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

const createApiClient = () => {
  const token = getCookie("token")
  const headers: any = {
    'Content-Type': 'application/json',
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`import axios from "axios"
import { getCookie } from "cookies-next"

const token = getCookie("token")

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    Authorization: `Bearer ${token}`
  }
})
export interface Post {
  id: string
  thread_id: string
  content: string
  created_by: string
  created_at: string
  updated_at: string
  vote: number | null
  relevancy: number
}
export const req_create_post = async (thread_id: string, content: string): Promise<Post> => {
  try {
    const res = await api.post<Post>(
      "/api/threads/posts",
      {
        thread_id,
        content,
      }
    )

    return res.data

  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        "Erro ao criar resposta"
    )
  }
}

export interface UpdatePost{
    content: string
}
export const req_search_post_id = async(post_id: string): Promise<Post> =>{
    try{
        const res = await api.get<Post>(`/api/threads/posts/${post_id}`)

        return res.data

    }catch(error: any){
        throw new Error(
            error.response?.data?.message ||
            "Erro ao buscar post"
        )
    }
}

export const req_update_post = async(post_id: string, data: UpdatePost ): Promise<Post> =>{ 
    try{
        const res = await api.patch<Post>(`/api/threads/posts/${post_id}`,data)

        return res.data

    }catch(error: any){
        throw new Error(
            error.response?.data?.message ||
            "Erro ao atualizar a resposta"
        )
    }
}

export const req_get_posts_by_thread = async(thread_id: string): Promise<Post[]> => {
  try {
    const res = await api.get<Post[]>(`/api/threads/posts/thread/${thread_id}`)

    return res.data
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        "Erro ao listar respostas da thread"
    )
  }
}


  }

  return axios.create({
    baseURL: API_BASE,
    withCredentials: true,
    headers
  })
}

export const req_create_post = async (thread_id: string, content: string): Promise<Post> => {
  try {
    const api = createApiClient()
    const res = await api.post<Post>(
      "/api/threads/posts/",
      {
        thread_id,
        content,
      }
    )

    return res.data

  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        "Erro ao criar resposta"
    )
  }
}

//export const req_list_post = async(thread_id: string ):Promise<> // esta dando erro ao colocar a informação outra hora eu faço isso 
  
export interface UpdatePost{
    content: string
}
export const req_search_post_id = async(post_id: string): Promise<Post> =>{
    try{
        const api = createApiClient()
        const res = await api.get<Post>(`/api/threads/posts/${post_id}`)

        return res.data

    }catch(error: any){
        throw new Error(
            error.response?.data?.message ||
            "Erro ao buscar post"
        )
    }
}

export const req_update_post = async(post_id: string, data: UpdatePost ): Promise<Post> =>{ 
    try{
        const api = createApiClient()
        const res = await api.patch<Post>(`/api/threads/posts/${post_id}`,data)

        return res.data

    }catch(error: any){
        throw new Error(
            error.response?.data?.message ||
            "Erro ao atualizar a resposta"
        )
    }
}
