import React from 'react'
import Usuario from './Usuario'

interface TypeUser {
  colocacao: "primeiro" | "segundo" | "terceiro";
  pontos: string | number;
}

function UsuarioRanking({ colocacao, pontos }: TypeUser) {
  const colocacaotitulo = {
    primeiro: "1#",
    segundo: "2#",
    terceiro: "3#"
  }

  const bgColocacao = {
    primeiro: "bg-yellow-500",
    segundo: "bg-gray-400",
    terceiro: "bg-[#CD7F32]"
  }
  
  return (
    <div className="max-h-[32vh] overflow-y-auto pr-2 ">
      <ul className="space-y-2 py-2">
        <li className="flex items-center gap-6 p-3 bg-gray-100 rounded-md shadow-sm  ">
          
          <div className={`px-3 py-1 rounded-xl text-white font-semibold ${bgColocacao[colocacao]}`}>
            {colocacaotitulo[colocacao]}
          </div>

          <Usuario />

          <strong className="text-blue-600 text-lg ml-60">{pontos}</strong>

        </li>
      </ul>
    </div>
  )
}

export default UsuarioRanking
