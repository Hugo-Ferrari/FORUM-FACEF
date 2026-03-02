import axios from "axios"
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
export interface VoteRequest {
  post_id: string
  vote_type: 'upvote' | 'downvote'
}

export const req_vote_post = async(data: VoteRequest): Promise<{ message: string; success: boolean }> => {
  try {
    const res = await api.post<{ message: string; success: boolean }>(
      '/api/threads/votes/',
      data
    )
    return res.data
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        "Erro ao registrar voto"
    )
  }
}

export const req_remove_vote = async(post_id: string): Promise<{ message: string; success: boolean }> => {
  try {
    const res = await api.delete<{ message: string; success: boolean }>(
      `/api/threads/votes/${post_id}`
    )
    return res.data
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        "Erro ao remover voto"
    )
  }
}
