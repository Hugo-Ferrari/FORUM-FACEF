import React from 'react'
import Ranking from '../components/ranking/RankingGeral'
import Block from "@/app/components/blocosDeExibição/DisplayBlock";
import ButtonRanking from "@/app/components/ranking/ButtonRanking";

function page() {
  return (
    <div>
        <h1 className=' text-black font-extrabold text-4xl '>Ranking</h1>

        <div className='mt-10 w-full max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
            <Block tipo="duvidas" valor={10} />
            <Block tipo="ranking" valor="#10" />
            <Block tipo="sequencia" valor={7} />
            <Block tipo="materias" valor={27} />
        </div>

        <Ranking />
    </div>
  )
}

export default page