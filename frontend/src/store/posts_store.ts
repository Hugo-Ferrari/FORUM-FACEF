import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

import {
  Post,
  UpdatePost,
  req_create_post,
  req_search_post_id,
  req_update_post
} from "@/requests/posts_requests"

interface PostState {
  posts: Post[]
  loading: boolean
  error: string | null

  createPost: (thread_id: string, content: string) => Promise<void>
  searchPostById: (post_id: string) => Promise<Post>
  updatePost: (post_id: string, data: UpdatePost) => Promise<void>
}

export const usePostStore = create<PostState>()(
  persist(
    (set, get) => ({posts: [],loading: false,error: null,

      createPost: async (thread_id, content) => {
        try {
          set({ loading: true, error: null })

          const newPost = await req_create_post(thread_id, content)

          set((state) => ({
            posts: [...state.posts, newPost],
            loading: false,
          }))
        } catch (err: any) {
          set({
            error: err.message,
            loading: false,
          })
        }
      },

      searchPostById: async (post_id) => {
        try {
          set({ loading: true, error: null })

          const post = await req_search_post_id(post_id)

          set({ loading: false })

          return post
        } catch (err: any) {
          set({
            error: err.message,
            loading: false,
          })
          throw err
        }
      },

      updatePost: async (post_id, data) => {
        try {
          set({ loading: true, error: null })

          const updated = await req_update_post(post_id, data)

          set((state) => ({
            posts: state.posts.map((p) =>
              p.id === post_id ? updated : p
            ),
            loading: false,
          }))
        } catch (err: any) {
          set({
            error: err.message,
            loading: false,
          })
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
              setItem: () => {},
              removeItem: () => {},
            }
      ),
    }
  )
)