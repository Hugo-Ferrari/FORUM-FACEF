"use client"

import React, { useState } from "react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import DuvidasList from "./DuvidasList"
import {useThreadStore} from "@/store/threads_store";
import {useAuthStore} from "@/store/auth_store";


function AddThreads() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState<boolean>(false)


  const course_id = useAuthStore(s => s.course_id)

  if (!course_id) {
    return (
        <div className='bg-background min-h-screen w-full overflow-x-hidden flex items-center justify-center'>
          <p>Loading course data...</p>
        </div>
    )
  }

  const handleAddThreads = () => {
    setLoading(true)
    const { createThread } = useThreadStore.getState()
    createThread(title, content, course_id, false).then(() => {
      setOpen(false)
      setLoading(false)
    })
  }

  return (
    <div className="flex flex-col items-start w-150 py-6 gap-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
              onClick={() => {setOpen(true)}}
              className="bg-blue-600 text-white dark:text-black px-4 py-2 rounded-md hover:bg-blue-700 transition self-center ml-25 -mt-16 "
          >
            Adicionar Dúvida
          </button>
        </PopoverTrigger>

        <PopoverContent className="w-80 p-4">
          <h2 className="text-lg font-semibold mb-2 text-foreground dark:text-foreground">Nova Dúvida</h2>
          <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            placeholder="Titulo para Duvida"
            className=" w-full border border-border dark:border-border rounded-md px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-card text-black dark:text-white"
          />

          <input
              value={content}
              onChange={(e) => setContent(e.target.value)}
            placeholder="Descreva sua dúvida"
            className=" w-full border border-border dark:border-border rounded-md px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-card text-black dark:text-white"
          />

          <div className="flex justify-end">
            <button
                onClick={handleAddThreads}
                disabled={loading}
              className="bg-blue-600 text-white dark:text-black px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              {loading ? "Enviando..." : "Enviar"}
            </button>
          </div>
        </PopoverContent>
      </Popover>

      <DuvidasList  type={"modal"} />
    </div>
  )
}

export default AddThreads
