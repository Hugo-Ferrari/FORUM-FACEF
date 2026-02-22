import React from 'react'
import Materia from '@/components/materia'
import ChatCurso from "@/components/chat/ChatCurso";
import CourseThreads from "@/components/threads/CourseThreads";

function page() {
  return (
    <div className='py-10 w-full overflow-x-hidden bg-background'>
      <div className='flex'>
          <ChatCurso />
        <div className='flex flex-col w-115 mt-10 mr-15 bg-background text-black dark:text-white'>
            <CourseThreads />
          <Materia />
        </div>
      </div>
    </div>
  )
}

export default page