"use client"
import React, { useState } from 'react'
import Block from '../blocosDeExibição/DisplayBlock'
import ButtonRanking from './ButtonRanking'
import Users from '../user/UsuarioRanking'





function RankingGeral() {
    return (
        <div className='flex flex-col p-8 max-w-7xl mx-auto'>
            <h1 className=' text-black font-extrabold text-4xl '>Ranking</h1>

            <div className='mt-10 w-full max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
                <Block tipo="duvidas" valor={10} />
                <Block tipo="ranking" valor="#10" />
                <Block tipo="sequencia" valor={7} />
                <Block tipo="materias" valor={27} />
            </div>
            <div className='mt-5 flex'>
                <ButtonRanking tipo='ranking' />
                <ButtonRanking tipo='curso' />

            </div>
            <div  className='py-5'>
            <h1 className='font-semibold text-lg '>Ranking - Geral</h1>

            </div>
            <div className="max-h-[32vh] overflow-y-auto pr-2 max-w-2xl">
                <Users colocacao='primeiro' pontos={130} />
                <Users colocacao='segundo' pontos={120} />
                <Users colocacao='terceiro' pontos={111} />
            </div>
        </div>
    )
}
export default RankingGeral