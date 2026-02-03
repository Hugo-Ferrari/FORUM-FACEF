import React from 'react'
import Block from "@/components/DisplayBlock";
import RankingGeral from "@/app/ranking/components/RankingGeral";

function page() {
  return (
    <div>
        <h1 className=' text-black dark:text-white font-extrabold text-4xl bg-background'>Ranking</h1>

        <div className='mt-10 w-full max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
            <Block tipo="duvidas" valor={10} />
            <Block tipo="ranking" valor="#10" />
            <Block tipo="sequencia" valor={7} />
            <Block tipo="materias" valor={27} />
        </div>

        <RankingGeral />
    </div>
  )
}

export default page