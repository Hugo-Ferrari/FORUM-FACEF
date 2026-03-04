"use client"

import React, { useEffect, useState } from "react"
import Usuario from "@/components/user/Usuario"
import { useThreadStore, Thread } from "@/store/threads_store"
import { usePostStore } from "@/store/posts_store"
import { useAuthStore } from "@/store/auth_store"
import PostItem from "../components/PostItem"
import { req_create_post } from "@/requests/posts_requests"


interface Props {
  params: { threadId: string }
}

export default function RespostasPage({ params }: Props) {
  const { posts, fetchPostsByThread } = usePostStore()
  const { currentThread, fetchThreadById } = useThreadStore()
  const [responseText, setResponseText] = useState("")
  const name = useAuthStore(state => state.name)
  const course = useAuthStore(state => state.course)



  const handleSendResponse = async () => {
    if (!responseText.trim() || !currentThread) return

    try {
      await req_create_post(currentThread.id, responseText)
      setResponseText("")
    } catch (error) {
      console.error("Erro ao enviar resposta:", error)
    }
  }

  const sortedPosts = [...posts].sort((a, b) => b.relevancy - a.relevancy)
  return (
    <div className="p-4">
      {currentThread && (
        <div className="mt-4">
          <h2 className="font-bold text-2xl ml-2">DÚVIDA</h2>
          <div className="mt-4 mb-6 bg-white/50 dark:bg-card p-4 rounded">
            <Usuario name={currentThread.created_by} course={course} course_year={currentThread.year} />
            <h2 className="text-xl font-semibold">{currentThread.title}</h2>
            <p>{currentThread.content}</p>
            <div className="mt-3 text-sm text-gray-600">
              Aberta por <strong>{name}</strong> · {currentThread.posts} resposta{currentThread.posts !== 1 ? "s" : ""}
            </div>
          </div>
        </div>
      )}

      <h3 className="font-semibold mb-4">Adicionar Resposta</h3>
      <div className="mb-6 bg-white/50 dark:bg-card p-4 rounded">
        <textarea
          value={responseText}
          onChange={(e) => setResponseText(e.target.value)}
          placeholder="Digite sua resposta"
          className="w-full border border-border rounded-md px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-card text-black dark:text-white"
          rows={4}
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={handleSendResponse}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Enviar resposta
          </button>
        </div>
      </div>

      <h3 className="font-semibold mb-4">Respostas</h3>
      {posts.length === 0 && (
        <p className="text-gray-600">Ainda não há respostas.</p>
      )}

      <ul className="space-y-3">
        {sortedPosts.map(post => (
          <li key={post.id}>
            <PostItem post={post} />
          </li>
        ))}
      </ul>
    </div>
  )
}
