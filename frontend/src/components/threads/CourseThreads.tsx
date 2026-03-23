"use client"

import React from "react"

import{ Star } from "lucide-react"
import AddThreads from "./AddThreads"
import { useAuthStore } from "@/store/auth_store"
import DuvidasList from "./DuvidasList"

function CourseThreads() {
  const courseName = useAuthStore(s => s.course)

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2"
          >
            <div className="flex items-center gap-2 text-yellow-500 font-black tracking-[0.2em] uppercase text-[10px]">
              <Star className="w-3.5 h-3.5 fill-current" /> 
              Comunidade Acadêmica
            </div>
            
            <h1 className="font-display font-black text-4xl md:text-5xl text-blue-600 tracking-tight">
              Fórum <span className="text-gradient-gold">Acadêmico</span>
            </h1>
            
            <p className="text-muted-foreground max-w-md font-medium text-sm leading-relaxed">
              Tire dúvidas sobre <span className="text-foreground font-bold">{courseName || "seu curso"}</span>, 
              compartilhe conhecimento e colabore com outros estudantes.
            </p>
          </div>

          
          <div className="shrink-0">
             <AddThreads />
          </div>
        </header>

       
        <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent mb-8" />
        <DuvidasList type="page"/>
        
      </div>
    </div>
  );
}

export default CourseThreads;