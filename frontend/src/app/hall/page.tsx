import { Badge } from '@/components/ui/badge'
import { UserHall } from '@/components/user/UserHall'


import { Star } from 'lucide-react'
import { Playwrite_CA } from 'next/font/google'
import React from 'react'

function page() {
  return (
    <div>
      <header className=" flex flex-col py-15 items-center">
        <div className='py-5'>
          <Badge variant={"secondary"} className='bg-yellow-500 to-transparent  text-gray-600 text-sm '  >
            <Star></Star>
            Lendas Eternizadas
          </Badge>
        </div>
        <div className=' font-extrabold text-5xl flex'>
          <h2 className='text-blue-600 '>
            Hall da
          </h2>
          <h2 className='text-yellow-500 ml-4'>
            Fama
          </h2>
        </div>
        <div>
          <p className='text-gray-600'>Os maiores competidores de todos os tempos. Seus feitos ecoam para sempre.</p>
        </div>
      </header>
      <div>
        <section>
            <UserHall name={"hugo"} email= {"batata@123"} pontos ={999}></UserHall>
            <UserHall name={"hugo"} email= {"batata@123"} pontos ={999}></UserHall>
            <UserHall name={"hugo"} email= {"batata@123"} pontos ={999}></UserHall>
            <UserHall name={"hugo"} email= {"batata@123"} pontos ={999}></UserHall>

        </section>
      </div>







    </div>
  )
}

export default page