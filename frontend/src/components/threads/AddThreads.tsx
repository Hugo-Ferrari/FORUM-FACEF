"use client"

import React, { useState } from "react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Plus, Send, Sparkles, X } from "lucide-react"

import { useThreadStore } from "@/store/threads_store"
import { useAuthStore } from "@/store/auth_store"

function AddThreads() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState<boolean>(false)

  const course_id = useAuthStore(s => s.course_id)

  if (!course_id) return null

  const handleAddThreads = () => {
    if (!title.trim()) return
    setLoading(true)
    const { createThread } = useThreadStore.getState()
    createThread(title, content, course_id, false).then(() => {
      setOpen(false)
      setLoading(false)
      setTitle("")
      setContent("")
    })
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button 
          className="bg-blue-600 inline-flex items-center gap-2  hover:bg-blue-600/90 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-primary/20"
        >
          <Plus className="w-4 h-4 " /> Nova Dúvida
        </button>
      </PopoverTrigger>

      <PopoverContent 
        className="w-[380px] md:w-[450px] p-0 border-none shadow-2xl rounded-2xl overflow-hidden" 
        align="end"
      >
       
        <div className="bg-blue-400 p-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 fill-current" />
            <span className="font-bold text-xs uppercase tracking-widest">Criar nova thread</span>
          </div>
          <button 
            onClick={() => setOpen(false)}
            className="hover:rotate-90 transition-transform p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 bg-card space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Título da Dúvida</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Erro ao configurar o banco de dados..."
              className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Conteúdo</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Descreva sua dúvida com detalhes..."
              rows={4}
              className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
            />
          </div>

          <div className="flex items-center justify-end pt-2">
            <button
              onClick={handleAddThreads}
              disabled={loading || !title.trim()}
              className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 disabled:opacity-50 transition-all shadow-md shadow-primary/10"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
              {loading ? "Enviando..." : "Publicar Pergunta"}
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default AddThreads