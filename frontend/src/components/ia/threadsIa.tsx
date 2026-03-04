import React, { useState } from 'react'
type Mensagem = {
  autor: "user" | "Ia",
  texto: string
}
function ThreadsIa() {
  const [mensagens, setMensagens] = useState<Mensagem[]>([])
  const [msg, setMsg] = useState("")

  const handleEnviar = async () => {
    if (!msg.trim()) {
      return // retorna nada, até pq nn tem msg
    }

    const novaMensagemUser: Mensagem = {
      autor: "user",
      texto: msg
    }
    setMensagens(prev => [...prev, novaMensagemUser])

    setTimeout(() => {
      const respostaIa: Mensagem = {
        autor: "Ia",
        texto: "Resposta simulada"
      }
      setMensagens(prev => [...prev, respostaIa])
    }, 1000)

    setMsg("")
  }

  return (
    <div className='flex flex-col bg-white/80 p-4 rounded-lg shadow-lg max-w-xl w-100 mx-auto'>
      <h2 className='font-bold text-2xl text-center mb-2'>
        Tire sua dúvida comigo
      </h2>
     
      <img
        className='w-32 h-40 mx-auto mb-2'
        src='/img/FACEFINHO.png'
        alt='Facefinho'
      />
      <p className='text-center text-sm text-gray-600 mb-4'>Facefinho</p>

      <div className='flex-2 overflow-auto space-y-2 mb-4 max-h-40'>
        {mensagens.map((m, index) => (
          <div
            key={index}
            className={`p-2 rounded-lg  overflow-auto ${
              m.autor === "user"
                ? " text-right "
                : " text-left "
            }`}
          >
            {m.texto}
          </div>
        ))}
      </div>

      <textarea
        className='bg-white p-2 border border-gray-300 rounded-md resize-none w-full h-24'
        placeholder='Escreva sua mensagem...'
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
      />
      <button
        className='bg-blue-600 text-white dark:text-black px-4 py-2 rounded-md hover:bg-blue-700 transition self-center mt-2'
        onClick={handleEnviar}
      >
        Enviar
      </button>
    </div>
  )
}

export default ThreadsIa