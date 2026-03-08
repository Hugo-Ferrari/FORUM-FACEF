import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

import {
  Post,
  UpdatePost,
  req_create_post,
  req_get_posts_by_thread,
  req_search_post_id,
  req_update_post,
} from "@/requests/posts_requests"
import { req_remove_vote, req_vote_post } from "@/requests/vote_post_request"
import {useThreadStore} from "@/store/threads_store";

interface PostState {
  posts: Post[]
  loading: boolean
  error: string | null
  fetchPostsByThread: (thread_id: string) => Promise<void>
  createPost: (thread_id: string, content: string) => Promise<void>
  searchPostById: (post_id: string) => Promise<Post>
  updatePost: (post_id: string, data: UpdatePost) => Promise<void>
  votePost: (post_id: string, vote_type: 'upvote' | 'downvote') => Promise<void>
  removeVote: (post_id: string) => Promise<void>
}

export const usePostStore = create<PostState>()(
  persist(
    (set, get) => ({
      posts: [], loading: false, error: null,

      fetchPostsByThread: async (thread_id) => {
        try {
          const posts = await req_get_posts_by_thread(thread_id)
          set({ posts })
        } catch (err: any) {
          console.error("Erro ao buscar posts:", err)
        }
      },

      createPost: async (thread_id, content) => {
        try {
          await req_create_post(thread_id, content)
          await get().fetchPostsByThread(thread_id)
          await useThreadStore.getState().fetchThreadById(thread_id)

        } catch (err: any) {
          console.error("Erro ao criar post:", err)
          throw err
        }
      },

      searchPostById: async (post_id) => {
        try {
          return await req_search_post_id(post_id)
        } catch (err: any) {
          throw err
        }
      },

      updatePost: async (post_id, data) => {
        try {
          const updated = await req_update_post(post_id, data)
          set((state) => ({
            posts: state.posts.map((p) =>
              p.id === post_id ? updated : p
            ),
          }))
        } catch (err: any) {
          console.error("Erro ao atualizar post:", err)
          throw err
        }
      },

      votePost: async (post_id, vote_type) => {
        try {
          await req_vote_post({ post_id, vote_type })
          const voteChange = vote_type === 'upvote' ? 1 : -1
          set((state) => ({
            posts: state.posts.map((p) =>
              p.id === post_id
                ? { ...p, relevancy: p.relevancy + voteChange, vote: vote_type === 'upvote' ? 1 : -1 }
                : p
            ),
          }))
        } catch (err: any) {
          console.error("Erro ao votar no post:", err)
          throw err
        }
      },

      removeVote: async (post_id) => {
        try {
          await req_remove_vote(post_id)

          set((state) => ({
            posts: state.posts.map((p) =>
              p.id === post_id
                ? { ...p, relevancy: p.relevancy - (p.vote === 1 ? 1 : -1), vote: null }
                : p
            ),
          }))
        } catch (err: any) {
          throw err
        }
      },
    }),
    {
      name: "post-storage",
      storage: createJSONStorage(() =>
        typeof window !== "undefined"
          ? window.localStorage
          : {
            getItem: () => null,
            setItem: () => { },
            removeItem: () => { },
          }
      ),
    }
  )
)