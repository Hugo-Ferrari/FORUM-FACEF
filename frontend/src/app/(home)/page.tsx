"use client"

import React, { useEffect } from "react";

import Block from "@/components/DisplayBlock";
import CourseThreads from "@/components/threads/CourseThreads";
import ThreadsIa from "@/components/ia/threadsIa";
import { useAuthStore } from "@/store/auth_store";
import { useThreadStore } from "@/store/threads_store";


export default function Home() {
    const course_id = useAuthStore(s => s.course_id);
    const courseName = useAuthStore(s => s.course);
   
    useEffect(() => {
        if (course_id)  {
            const { fetchThreadsByCourse } = useThreadStore.getState();
            fetchThreadsByCourse(course_id);
        }
    }, [course_id]);

    if (!course_id) {
        return (
            <div className='bg-background min-h-screen w-full flex items-center justify-center'>
                <div className="flex flex-col items-center gap-4"
                >
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="font-bold text-muted-foreground animate-pulse">Sincronizando ambiente...</p>
                </div>
            </div>
        );
    }

    const stats = [
        { tipo: "duvidas", valor: 10 },
        { tipo: "ranking", valor: "#10" },
        { tipo: "sequencia", valor: 7 },
        { tipo: "materias", valor: 27 },
    ] as const;

  return (
      <div className='bg-background min-h-screen w-full overflow-x-hidden'>
          <div className='max-w-7xl mx-auto p-6 md:p-12'>
              
              
              <header className='mt-16 flex flex-col items-center text-center space-y-4'>

                  <h1  className='text-foreground font-black text-4xl md:text-6xl tracking-tight'
                  >
                    Bem-vindo à <span className="text-gradient-gold">Comunidade</span>
                  </h1>

                  <p className='text-muted-foreground max-w-2xl text-lg font-medium'
                  >
                      Conecte-se com alunos de <span className="text-foreground font-bold">{courseName}</span>. 
                      Tire dúvidas, colabore e acelere seu aprendizado.
                  </p>
              </header>

              
              <div className='mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
                  {stats.map((stat, i) => (
                      <Block 
                        key={stat.tipo} 
                        tipo={stat.tipo} 
                        valor={stat.valor} 
                        index={i} 
                      />
                  ))}
              </div>

              
              <div className='mt-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start'>
                  
                  
                  <div className="lg:col-span-7">
                      <CourseThreads />
                      
                  </div>

                  
                  <div className="lg:col-span-5 lg:sticky lg:top-24">
                      <div className="space-y-4">
                          <div className="flex items-center gap-2 px-2">
                             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                             <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Assistente Online</span>
                          </div>
                          <ThreadsIa />
                      </div>
                  </div>

              </div>
          </div>
      </div>
  );
}