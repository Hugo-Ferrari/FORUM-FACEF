"use client"
import React, { useState } from 'react'
import ButtonRanking from './ButtonRanking'
import Users from '@/components/user/UsuarioRanking'

function RankingGeral() {
    const [selected, setSelected] = useState<string>('curso')

    return (
        <div className='flex flex-col p-8 max-w-7xl mx-auto bg-background'>

            <div className='mt-5 flex'>
                <ButtonRanking tipo='ranking' setSelected={setSelected} />
                <ButtonRanking tipo='curso' setSelected={setSelected} />
            </div>
            <div  className='py-5'>
            <h1 className='font-semibold text-lg text-black dark:text-white'>
                {selected === 'ranking' ? 'Ranking - Geral' : 'Ranking - Meu Curso'}
            </h1>

            </div>
            <div className="max-h-[32vh] overflow-y-auto pr-2 max-w-2xl">
                {selected === 'ranking' ? (
                    <>
                        <Users colocacao='primeiro' pontos={130} />
                        <Users colocacao='segundo' pontos={120} />
                        <Users colocacao='terceiro' pontos={111} />
                    </>
                ) : (
                    <>
                        <Users colocacao='primeiro' pontos={99} />
                        <Users colocacao='segundo' pontos={88} />
                        <Users colocacao='terceiro' pontos={77} />
                    </>
                )}
            </div>
        </div>
    )
}
export default RankingGeral