import React from 'react'
import DuvUsuario from '@/components/duvidas/CaixaDuvida'
import Materia from '@/components/materia'
import ChatCurso from "@/components/chat/ChatCurso";

function page() {
  return (
    <div className='py-10 w-full overflow-x-hidden bg-background'>
      <div className='flex'>
          <ChatCurso />
        <div className='flex flex-col w-115 mt-10 mr-15 bg-background'>
          <DuvUsuario />
          <Materia />
        </div>
      </div>
    </div>
  )
}

export default page