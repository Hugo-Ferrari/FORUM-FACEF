"use client"

import React, { useState } from "react"
import { Badge } from "@/components/ui/badge"
import Usuario from "../user/Usuario"
import ButtonRes from "./ButtonRes"
import { ArrowDown, ArrowUp, MessageCircle } from "lucide-react"
import { useThreadStore } from "@/store/threads_store"
import {useAuthStore} from "@/store/auth_store";

interface DuvidasListProps {
  type: "modal" | "page"
}

function DuvidasList({ type }: DuvidasListProps) {
  const [openThreadId, setOpenThreadId] = useState<string | null>(null)
  const [responseText, setResponseText] = useState("")

  const threads = useThreadStore(s => s.threads || [])

  console.log(threads)

  const {createResponse} = useThreadStore.getState()
  const course_id = useAuthStore(s => s.course_id)
  const course = useAuthStore(s => s.course)

  if (!course_id) {
    return (
        <div className='bg-background min-h-screen w-full overflow-x-hidden flex items-center justify-center'>
          <p>Loading course data...</p>
        </div>
    )
  }

  const handleSendResponse = async (threadId: string) => {
    if (!responseText.trim()) return

    await createResponse(threadId, responseText)

    setResponseText("")
    handleCloseModal()
  }

  const handleOpenModal = (threadId: string) => {
    setOpenThreadId(threadId)
    setResponseText("")
  }

  const handleCloseModal = () => {
    setOpenThreadId(null)
    setResponseText("")
  }

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
                className="p-3 bg-muted dark:bg-muted rounded-md shadow-sm hover:bg-muted/70 dark:hover:bg-muted/50 cursor-pointer"
                onClick={() => handleOpenModal(thread.id)}
              >
                <Usuario name={thread.created_by} course={course} course_year={thread.year} />

                  <p className="flex font-semibold text-lg capitalize">{thread.title}</p>
                <p className="max-w-full break-words whitespace-pre-wrap">
                  {thread.content}
                </p>

                {openThreadId === thread.id && (
                  <div
                    className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center"
                    onClick={handleCloseModal}
                  >
                    <div
                      className="bg-white dark:bg-card p-4 rounded-lg shadow-lg max-w-md w-full"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <h3 className="text-lg font-semibold mb-2">
                        Dúvida
                      </h3>

                      <div className="mb-2">
                        <Badge variant="secondary">
                          <strong className="text-blue-600">
                            {thread.title}
                          </strong>
                        </Badge>

                        <p className="mt-2 text-black dark:text-white">
                          {thread.content}
                        </p>
                      </div>

                      <hr className="my-3" />

                      <h4 className="text-md font-semibold mb-2">
                        Respostas
                      </h4>

                      <p className="text-gray-500 mb-2">
                        Total de respostas: {thread.posts}
                      </p>

                      <textarea
                        value={responseText}
                        onChange={(e) =>
                          setResponseText(e.target.value)
                        }
                        placeholder="Digite sua resposta"
                        className="w-full border border-border rounded-md px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-card text-black dark:text-white"
                        rows={3}
                      />

                      <div className="flex justify-end gap-2">
                        <button
                          onClick={handleCloseModal}
                          className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                        >
                          Fechar
                        </button>

                        <button
                          onClick={() => handleSendResponse(thread.id)}
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Enviar resposta
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {type === "page" && (
                  <ButtonRes
                    icon1={ArrowUp}
                    icon2={ArrowDown}
                    numberVot={1120}
                    numberRes={thread.posts}
                    respostasIcon={MessageCircle}
                  />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default DuvidasList
