"use client"

import React, { useEffect, useState } from "react"
import Usuario from "@/components/user/Usuario"
import { useThreadStore } from "@/store/threads_store"
import { usePostStore } from "@/store/posts_store"
import { useAuthStore } from "@/store/auth_store"
import PostItem from "../components/PostItem"
import { req_create_post } from "@/requests/posts_requests"
import { usePathname } from "next/navigation";
import { MessageSquare, Send, BookOpen, AlertCircle, Clock, PenLine } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function RespostasPage() {
  const slug = usePathname().split("/").pop() || ""
  const { fetchPostsByThread } = usePostStore()
  const posts = usePostStore(state => state.posts)
  const { fetchThreadById } = useThreadStore()
  const currentThread = useThreadStore(state => state.currentThread)

  const [responseText, setResponseText] = useState("")
  const name = useAuthStore(state => state.name)
  const course = useAuthStore(state => state.course)

  useEffect(() => {
    if (slug) {
      const loadData = async () => {
        await fetchThreadById(slug)
        await fetchPostsByThread(slug)
      }
      loadData()
    }
  }, [slug]);

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
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0E14] pb-20">
      <div className="max-w-4xl mx-auto px-4 pt-8">
        
       
        {currentThread && (
          <div className="mb-12"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-blue-600 text-white text-2xl font-black px-2 py-0.5 rounded uppercase tracking-widest">
                Dúvida
              </span>
              <div className="h-[1px] flex-1 bg-slate-200 dark:bg-slate-800" />
            </div>

            <div className="bg-white dark:bg-card border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="p-6 md:p-8">
                <div className="mb-6">
                  <Usuario 
                    name={currentThread.created_by} 
                    course={course} 
                    course_year={currentThread.year} 
                  />
                </div>
                
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
                  {currentThread.title}
                </h2>
                
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg mb-6 whitespace-pre-wrap">
                  {currentThread.content}
                </p>

                <div className="flex items-center gap-4 pt-6 border-t border-slate-100 dark:border-slate-800/50">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    Criada por <span className="text-slate-700 dark:text-slate-200">{name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                    <MessageSquare className="w-3.5 h-3.5" />
                    {currentThread.posts} resposta{currentThread.posts !== 1 ? "s" : ""}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6 mb-12">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-bold text-2xl text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-blue-600" />
              Respostas da Comunidade
            </h3>
          </div>

          {posts.length === 0 ? (
            <div className="bg-slate-100 dark:bg-slate-900/50 border-2 border-dashed border-slate-200 dark:border-slate-800  p-12 text-center">
              <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 dark:text-slate-400 font-medium">Ainda não há respostas.</p>
              <p className="text-sm text-slate-400">Seja o primeiro a ajudar!</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {sortedPosts.map((post, index) => (
               
                  <div className="bg-white dark:bg-card border border-slate-200 dark:border-slate-800  overflow-hidden hover:shadow-md transition-shadow">
                    <PostItem post={post} />
                  </div>
              ))}
            </ul>
          )}
        </div>
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
          <div className="bg-white dark:bg-card border border-slate-200 dark:border-slate-800  p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg text-blue-600">
                <PenLine size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 dark:text-slate-100">Sua contribuição</h3>
                <p className="text-xs text-slate-400">Escreva uma resposta clara e objetiva</p>
              </div>
            </div>

            <textarea
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              placeholder="Digite sua resposta aqui..."
              className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none mb-4 min-h-[180px] dark:text-slate-200"
            />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-[11px] text-slate-400 max-w-[300px]">
                Ao enviar, sua resposta ficará visível para todos os alunos do curso de {course}.
              </p>
              
              <Button
                onClick={handleSendResponse}
                disabled={!responseText.trim()}
                className="w-full sm:w-auto px-8 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-2xl transition-all shadow-lg shadow-blue-200 dark:shadow-none flex items-center justify-center gap-2 group"
              >
                Enviar resposta
                <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}