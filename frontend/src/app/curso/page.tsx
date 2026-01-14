import React from 'react'
import Chat from '../components/chat/Chat'
import DuvUsuario from '../components/duvidas/CaixaDuvida'
import Materia from '../components/curso/materia'

function page() {
  return (
    <div className='py-10 w-full overflow-x-hidden'>
      <div className='flex'>
        <Chat />
        <div className='flex flex-col w-115 mt-10 mr-15 '>
          <DuvUsuario />
          <Materia />
          
        </div>
      </div>
    </div>
  )
}

export default page