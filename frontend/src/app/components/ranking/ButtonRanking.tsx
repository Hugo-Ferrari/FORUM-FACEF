import { LucideIcon, Medal, Trophy } from 'lucide-react'
import React, { useState } from 'react'
interface ButtonProps {
    tipo: "ranking" | "curso";
}

function ButtonRanking({ tipo }: ButtonProps) {
    const icons = {
        ranking: <Trophy className='size-4' />,
        curso: <Medal className='size-4 ' />
    }
    const titulos = {
        ranking: "Ranking Geral",
        curso: "Meu Curso"
    }
    //fazer ranking geral e ranking para o curso, colocar o href e especificar a rota...


    return (
        <div className="">
            <div className="flex items-center">
                <div className=''>

                <button
                    type="button"
                    /*
                    onClick={}
                    aria-expanded={}*/
                    className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-200 group hover:text-yellow-600 text-gray-700 "
                >
                    {icons[tipo]}
                    <span className="text-sm font-medium  ">{titulos[tipo]}</span>
                </button>
                </div>
            </div>
        </div>
    )
}

export default ButtonRanking