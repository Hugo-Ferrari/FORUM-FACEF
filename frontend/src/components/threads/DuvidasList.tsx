"use client"

import React, { useState } from "react"
import { Badge } from "@/components/ui/badge"
import Usuario from "../user/Usuario"
import Link from "next/link"
import { MessageCircle, X } from "lucide-react"
import { useThreadStore } from "@/store/threads_store"
import { useAuthStore } from "@/store/auth_store"

interface DuvidasListProps {
  type: "page"
}

function DuvidasList({ type }: DuvidasListProps) {
  const [selectedThread, setSelectedThread] = useState<string | null>(null)
  const threads = useThreadStore(s => s.threads || [])
  const course = useAuthStore(s => s.course)
  const course_id = useAuthStore(s => s.course_id)

  if (!course_id) {
    return (
      <div className="bg-background min-h-screen w-full overflow-x-hidden flex items-center justify-center">
        <p>Carregando dados do curso...</p>
      </div>
    )
  }

  const selectedThreadData = threads.find(t => t.id === selectedThread)

  return (
    <div className="mt-3 w-full ml-2 bg-background p-3">
      <h2 className="text-xl font-semibold mb-3 text-black dark:text-foreground">
        Dúvidas
      </h2>

      {threads.length === 0 ? (
        <p className="text-gray-600 ml-3">
          Nenhuma dúvida adicionada ainda.
        </p>
      ) : (
        <div className="max-h-[32vh] overflow-y-auto pr-2 bg-background">
          <ul className="space-y-2">
            {threads.map((thread) => (
              <li
                key={thread.id}
                className="p-3 bg-muted dark:bg-muted rounded-md shadow-sm hover:bg-muted/70 dark:hover:bg-muted/50 cursor-pointer transition"
                onClick={() => setSelectedThread(thread.id)}
              >
                <Usuario name={thread.created_by} course={course} course_year={thread.year} />

                {type === "page" ? (
                  <Link href={`/respostas/${thread.id}`} className="font-semibold text-lg capitalize text-blue-600 hover:underline block">
                    {thread.title}
                  </Link>
                ) : (
                  <p className="font-semibold text-lg capitalize">{thread.title}</p>
                )}
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                  {thread.content}
                </p>

                <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                  <MessageCircle size={16} />
                  <span>{thread.posts} resposta{thread.posts !== 1 ? "s" : ""}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedThread && selectedThreadData && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div
            className="bg-white dark:bg-card p-6 rounded-lg shadow-lg max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold">Dúvida</h3>
              <button
                onClick={() => setSelectedThread(null)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X size={20} />
              </button>
            </div>

            <Badge variant="secondary" className="mb-3">
              <strong className="text-blue-600">
                {selectedThreadData.title}
              </strong>
            </Badge>

            <p className="text-black dark:text-white mb-4">
              {selectedThreadData.content}
            </p>

            <hr className="my-4" />

            <div className="mb-4">
              <h4 className="text-md font-semibold mb-2">Respostas</h4>
              <p className="text-gray-500 mb-4">
                Total: {selectedThreadData.posts} resposta{selectedThreadData.posts !== 1 ? "s" : ""}
              </p>
            </div>

            <Link
              href={`/respostas/${selectedThreadData.id}`}
              className="w-full inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-center"
            >
              Ver respostas
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default DuvidasList