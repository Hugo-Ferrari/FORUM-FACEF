"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Star, Trophy, Users, MessageSquare, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { UserHall } from '@/components/user/UserHall'
import Block from '@/components/DisplayBlock'
import { Badge } from '@/components/ui/badge'

//informações que viram no Store logo logo
const legends = [
  { id: 1, name: "Hugo", email: "hugo@email.com", pontos: 1540 },
  { id: 2, name: "Ana Clara", email: "ana@email.com", pontos: 1200 },
  { id: 3, name: "Erik", email: "erik@email.com", pontos: 1150 },
  { id: 4, name: "Beatriz", email: "bia@email.com", pontos: 999 },
]

export default function page() {
  return (
    <div className="min-h-screen bg-background pb-20 overflow-x-hidden">
      
      
      <header className="relative flex flex-col pt-24 pb-16 items-center overflow-hidden">
        
        <div className="absolute top-0 left-1/2  w-full h-full " />
        
        <div className='py-5 z-10'
        >
          <Badge variant="secondary" className='bg-yellow-500/10 border-yellow-500/20 text-yellow-600 dark:text-yellow-400 px-4 py-1 gap-2' >
            <Star className="w-4 h-4 fill-current" />
            <span className="font-bold uppercase tracking-wider text-xs">Lendas Eternizadas</span>
          </Badge>
        </div>

        <div className='font-display font-black text-5xl md:text-7xl flex flex-wrap justify-center z-10 uppercase italic'
        >
          <h2 className='text-blue-600 dark:text-blue-500'>Hall da</h2>
          <h2 className='text-yellow-500 ml-4'>Fama</h2>
        </div>
        
        <p className='text-muted-foreground mt-4 text-center max-w-lg px-6 z-10'
        >
          Os maiores competidores de todos os tempos. <br className="hidden md:block"/> Seus feitos ecoam para sempre na nossa comunidade.
        </p>
      </header>

      
      <main className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {legends.map((user, index) => (
            <div >
              {/**colocar informações que passaram pelo backend como nome,email ou codigo e a quantidade de pontos */}
              <UserHall 
                name={user.name} 
                email={user.email} 
                pontos={user.pontos} 
              />
            </div>
          ))}
        </div>

        
        <div className="mt-32">
          <div className="flex flex-col items-center mb-10">
            <h3 className="text-2xl font-black uppercase italic text-foreground tracking-tighter">Impacto Global</h3>
            <div className="h-1 w-20 bg-blue-600 mt-2 rounded-full" />
          </div>

          <div className='w-full max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
            <Block tipo='duvidas' valor={10} />
            <Block tipo='respostas' valor={22} />
            <Block tipo='sequencia' valor={33} />
            
            <Block tipo='xp' valor={10245} />
          </div>
        </div>

        
        <div className="mt-24 flex flex-col items-center p-12 rounded-3xl bg-blue-600 dark:bg-blue-700 relative overflow-hidden shadow-2xl shadow-blue-500/20"
        >
          
          <Trophy className="absolute -right-10 -bottom-10 w-64 h-64 text-white/10 rotate-12" />
          
          <h2 className="text-3xl font-black text-white uppercase italic mb-4 relative z-10">Quer entrar para a história?</h2>
          <p className="text-blue-100 mb-8 relative z-10 text-center max-w-md">
            A temporada atual está a todo vapor. Ganhe pontos ajudando a comunidade e suba no ranking!
          </p>
          
          <Link
            href="/ranking"
            className="group flex items-center gap-3 bg-white text-blue-600 font-black uppercase italic px-8 py-4 rounded-xl hover:bg-yellow-400 hover:text-yellow-900 transition-all active:scale-95 relative z-10 shadow-lg"
          >
            Ver Ranking da Temporada
            <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </main>

    </div>
  )
}