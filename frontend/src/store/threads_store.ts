import {
    req_get_thread_by_course_id,
    req_create_threads,
    ThreadResponse
} from "@/requests/threads_request"
import { req_create_post } from "@/requests/posts_requests";

import { persist, createJSONStorage } from "zustand/middleware";
import { create } from "zustand"

export interface Thread {
  id: string
  title: string
  content: string
  is_anonymous: boolean
  created_by: string
  created_at: string
  year: number
  posts: number
}

interface ThreadStore {
  threads: Thread[]
  count: number

  fetchThreadsByCourse: (course_id: string) => Promise<void>
  createThread: (title: string,content: string,course_id: string,is_anonymous: boolean) => Promise<void>

  createResponse: (thread_id: string, content: string) => Promise<void>
}

export const useThreadStore = create<ThreadStore>()(
    persist(
        ((set, get) => ({
              threads: [],
              count: 0,

              fetchThreadsByCourse: async (course_id) => {
                try {
                  const data: ThreadResponse = await req_get_thread_by_course_id(course_id)

                  set({
                    threads: data.threads.reverse(),
                    count: data.count
                  })
                } catch (err: any) {
                  console.error("Erro ao buscar threads:", err)
                }
              },

              createThread: async (title, content, course_id, is_anonymous) => {
                try {
                  await req_create_threads(
                      title,
                      content,
                      course_id,
                      is_anonymous
                  )

                    await get().fetchThreadsByCourse(course_id)

                } catch (err: any) {
                  console.error("Erro ao criar thread:", err)
                }
              },

              createResponse: async (thread_id, content) => {
                try {
                  await req_create_post(thread_id, content)

                  // Incrementa o contador de posts na thread
                  set((state) => ({
                    threads: state.threads.map((thread) =>
                        thread.id === thread_id
                            ? { ...thread, posts: thread.posts + 1 }
                            : thread
                    )
                  }))

                } catch (err: any) {
                  console.error("Erro ao criar resposta:", err)
                }
              },
            })
        ), {
          name: "thread-storage",
          storage: createJSONStorage(() =>
              typeof window !== "undefined" && typeof window.localStorage !== "undefined"
                  ? window.localStorage
                  : {
                    getItem: () => null,
                    setItem: () => {},
                    removeItem: () => {},
                  }),
        }
    )
)
