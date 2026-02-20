import { getThreadById, getThreadsByCourse, req_threads,  } from "@/requests/threads_request"

import { create } from "zustand"

export interface Thread {
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

interface ThreadStore {
  threads: Thread[]
  loading: boolean
  error: string | null

  fetchThreads: (course_id: string) => Promise<void>
  createThread: (title: string,content: string,course_id: string,is_anonymous: boolean) => Promise<void>

  createResponse: (thread_id: string,content: string) => Promise<void>
}

export const useThreadStore = create<ThreadStore>((set) => ({
  threads: [],
  loading: false,
  error: null,

  fetchThreads: async (course_id) => {
    set({ loading: true, error: null })

    try {
      const data = await getThreadsByCourse(course_id)

      set({
        threads: data,
        loading: false,
      })
    } catch (err: any) {
      set({
        error: err.message,
        loading: false,
      })
    }
  },

  createThread: async (title, content, course_id, is_anonymous) => {
    set({ loading: true, error: null })

    try {
      const newThread = await req_threads(
        title,
        content,
        course_id,
        is_anonymous
      )

      set((state) => ({
        threads: [newThread, ...state.threads],
        loading: false,
      }))
    } catch (err: any) {
      set({
        error: err.message,
        loading: false,
      })
    }
  },

  createResponse: async (thread_id) => {
    set({ loading: true, error: null })

    try {
      await getThreadById(thread_id)

      set((state) => ({
        threads: state.threads.map((thread) => thread.id === thread_id
          ? { ...thread, posts: thread.posts + 1 }
          : thread
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
}))
