"use client"

import React, { useEffect, useState } from "react"
import {AnimatePresence } from "framer-motion"
import { MessageSquare, Clock, ChevronRight, Sparkles, CheckCircle2, Brain } from "lucide-react"
import Link from "next/link"
import Usuario from "../user/Usuario"
import { useThreadStore } from "@/store/threads_store"
import { useAuthStore } from "@/store/auth_store"

interface DuvidasListProps {
  type: "page" | "modal"
}

function DuvidasList({ type }: DuvidasListProps) {
  const fetchThreadsByCourse = useThreadStore(s => s.fetchThreadsByCourse)
  const threads = useThreadStore(s => s.threads)
  const course_id = useAuthStore(s => s.course_id)
  const course = useAuthStore(s => s.course)

  

useEffect(() => {
    if (course_id) {
      fetchThreadsByCourse(course_id)
    }
  }, [course_id, fetchThreadsByCourse])

  // Log de depuração - verifique o console do navegador
  console.log("Estado atual:", { course_id, threads });

  if (!course_id) {
    return (
      <div className="flex justify-center p-12">
        <div className="animate-pulse flex flex-col items-center gap-2">
           <p className="text-xs font-bold text-muted-foreground uppercase">Sincronizando...</p>
        </div>
      </div>
    )
  }
  

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between mb-2 px-1">
        <h2 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
          {type === "page" ? <><Brain size={14} className="text-primary" /> Dúvidas da Comunidade</> : "Discussão"}
        </h2>
        <span className="text-[10px] font-bold bg-muted px-2 py-1 rounded text-muted-foreground">
          {threads.length} TÓPICOS
        </span>
      </div>

      {threads.length === 0 ? (
        <div className="p-12 border-2 border-dashed border-border rounded-3xl flex flex-col items-center text-center gap-3"
        >
          <MessageSquare className="w-10 h-10 text-muted-foreground/30" />
          <p className="text-muted-foreground font-medium">Nenhuma dúvida por aqui ainda.<br/>Seja o primeiro a perguntar!</p>
        </div>
      ) : (
        <div className="space-y-4 h-165 overflow-y-auto">
          <AnimatePresence mode="popLayout">
            {threads.map((thread, i) => (
              <div className="group relative "
              >
                <Link href={`/respostas/${thread.id}`}>
                  <div className="p-5 bg-card border border-border  transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 cursor-pointer flex flex-col gap-4">
                    
                    
                    <div className="flex items-center justify-between">
                      <Usuario 
                        name={thread.created_by} 
                        course={course} 
                        course_year={thread.year ? Number(thread.year) : 1} 
                      />
                      <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground bg-muted/50 px-2 py-1 rounded-lg">
                        <Clock size={12} />
                        {thread.year ? `${thread.year}º ANO` : 'CALOURO'}
                      </div>
                    </div>

                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {thread.posts > 5 && <CheckCircle2 size={16} className="text-green-500 shrink-0" />}
                        <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors leading-tight capitalize">
                          {thread.title}
                        </h3>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {thread.content}
                      </p>
                    </div>

                    
                    <div className="flex items-center justify-between pt-2 border-t border-border/50">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <div className="p-1.5 bg-primary/5 rounded-md text-primary">
                            <MessageSquare size={14} />
                          </div>
                          <span className="text-xs font-bold text-foreground">
                            {thread.posts} <span className="text-muted-foreground font-medium">respostas</span>
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 text-primary text-xs font-bold opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                        Ver discussão <ChevronRight size={14} />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

export default DuvidasList