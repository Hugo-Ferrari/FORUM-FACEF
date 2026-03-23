"use client"

import React, { useState, useRef, useEffect } from 'react'
import {  AnimatePresence } from 'framer-motion'
import { Send, Sparkles, Bot, User, Eraser, MessageCircle } from 'lucide-react'
import { Button } from '../ui/button'

type Mensagem = {
  autor: "user" | "Ia",
  texto: string
}

function ThreadsIa() {
  const [mensagens, setMensagens] = useState<Mensagem[]>([])
  const [msg, setMsg] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [mensagens, isTyping])

  const handleEnviar = async () => {
    if (!msg.trim()) return

    const novaMensagemUser: Mensagem = {
      autor: "user",
      texto: msg
    }

    setMensagens(prev => [...prev, novaMensagemUser])
    setMsg("")
    setIsTyping(true)

    setTimeout(() => {
      const respostaIa: Mensagem = {
        autor: "Ia",
        texto: "Olá! Sou o Facefinho. Como posso ajudar você?"
      }
      setMensagens(prev => [...prev, respostaIa])
      setIsTyping(false)
    }, 1500)
  }

  return (
    <div className='flex flex-col bg-card border border-border  shadow-2xl max-w-xl max-h-sm w-full mx-auto overflow-hidden transition-all'>
      

      <div className='bg-muted/30 p-6 flex flex-col items-center border-b border-border'>
        <div className='relative group'>
          <div  className="absolute -inset-1  to-blue-400 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"
          ></div>
          <img
            className='relative w-20 h-20 object-contain'
            src='/img/FACEFINHO.png'
            alt='Facefinho'
          />
          <div className='absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-4 border-card rounded-full shadow-sm'></div>
        </div>
        
        <h2 className='mt-4 font-black text-2xl text-foreground flex items-center gap-2 tracking-tight'>
          Facefinho 
        </h2>
        <div className='flex items-center gap-2 mt-1'>
          <span className='text-[10px] uppercase font-black tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-full'>
            IA Acadêmica
          </span>
        </div>
      </div>
      
      
      <div 
        ref={scrollRef}
        className='flex-1 overflow-y-auto space-y-6 p-6 min-h-[350px] max-h-[450px] scrollbar-thin scrollbar-thumb-primary/20 bg-dot-pattern'
      >
        <AnimatePresence initial={false}>
          {mensagens.length === 0 && (
            <div className='flex flex-col items-center justify-center h-full text-center space-y-4 opacity-50'
            >
              <div className='p-4 bg-muted rounded-full'>
                <MessageCircle size={32} className='text-muted-foreground' />
              </div>
              <p className='text-sm font-medium text-muted-foreground italic max-w-[200px]'>
                Sua conversa com o assistente do curso aparece aqui...
              </p>
            </div>
          )}

          {mensagens.map((m, index) => (
            <div 
              className={`flex ${m.autor === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex gap-3 max-w-[85%] ${m.autor === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-lg ${
                  m.autor === "user" ? " bg-black/15 text-blue-600" : "bg-card border border-border text-foreground"
                }`}>
                  {m.autor === "user" ?  <User size={14}/> : <Bot size={14} />}
                </div>
                
                <div className={`p-4 rounded-2xl text-sm font-medium leading-relaxed shadow-sm ${
                  m.autor === "user" 
                    ? "bg-blue-600 text-primary-foreground rounded-tr-none" 
                    : "bg-muted text-foreground rounded-tl-none border border-border/50"
                }`}>
                  {m.texto}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div  className="flex justify-start">
               <div className="bg-muted p-4 rounded-2xl rounded-tl-none flex gap-1.5 items-center border border-border/50">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]"></span>
               </div>
            </div>
          )}
        </AnimatePresence>
      </div>

      
      <div className='p-6 bg-muted/20 border-t border-border'>
        <div className='relative group'>
          <textarea
            className='w-full bg-card border border-border rounded-2xl p-4 pr-16 text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all resize-none h-24 font-medium placeholder:text-muted-foreground/50'
            placeholder='Tire uma dúvida sobre React, Node ou lógica...'
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleEnviar();
              }
            }}
          />
          <div className='absolute bottom-3 right-3 flex items-center gap-1'>
            <AnimatePresence>
              {mensagens.length > 0 && (
                <button 
                  onClick={() => setMensagens([])}
                  className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all"
                  title="Limpar conversa"
                >
                  <Eraser size={18} />
                </button>
              )}
            </AnimatePresence>
            <Button
              className='bg-primary text-primary-foreground p-2.5 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:grayscale'
              onClick={handleEnviar}
              disabled={!msg.trim()}
            >
              <Send size={18} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ThreadsIa