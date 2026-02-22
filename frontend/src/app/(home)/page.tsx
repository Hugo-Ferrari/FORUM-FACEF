"use client"

import Block from "@/components/DisplayBlock";
import React, {useEffect} from "react";
import AllEvents from "../calendario/components/allEvents";
import CourseThreads from "@/components/threads/CourseThreads";
import {useAuthStore} from "@/store/auth_store";
import {useThreadStore} from "@/store/threads_store";

export default function Home() {
    const course_id = useAuthStore(s => s.course_id)

    useEffect(() => {
        if (course_id)  {
            const {fetchThreadsByCourse} = useThreadStore.getState()
            fetchThreadsByCourse(course_id)
        }
    }, [course_id]);

    if (!course_id) {
        return (
            <div className='bg-background min-h-screen w-full overflow-x-hidden flex items-center justify-center'>
                <p>Loading course data...</p>
            </div>
        );
    }

  return (
      <div className='bg-background min-h-screen w-full overflow-x-hidden'>
          <div className='flex flex-col items-center p-8 max-w-7xl mx-auto'>
              <h1 className='mt-20 text-foreground font-extrabold text-5xl'>Bem-Vindo à Comunidade</h1>
              <p className='text-muted-foreground dark:text-muted-foreground mt-4 text-center'>
                  Conecte-se, tire dúvidas, compartilhe conhecimento e cresça junto com seus colegas acadêmicos.
              </p>
              <div className='mt-10 w-full max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
                  <Block tipo = "duvidas" valor = {10}/>
                  <Block tipo = "ranking" valor = "#10"/>
                  <Block tipo = "sequencia" valor = {7}/>
                  <Block tipo = "materias" valor = {27}/>
              </div>
              <div className='mt-10 w-full flex'>
                  <CourseThreads />
                  <div className="ml-15 mt-15">
                    <AllEvents />
                  </div>
              </div>
          </div>
      </div>
  );
}
