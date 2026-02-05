/** quando o modal for ativo o botão de comentaris desaparecerá e os botoes de "like" ou "deslike" aparecerá assim fazendo os comentarios terem relevancia */
import { LucideIcon } from 'lucide-react'
import React, { useState } from 'react'
import { Badge } from '../ui/badge'
import DuvUsuario from './CaixaDuvida'
import DuvidasList from './DuvidasList'

interface PropsButton {
  numberVot: number
  numberRes: number
  icon1: LucideIcon
  icon2: LucideIcon
  respostasIcon: LucideIcon
  doubtsList?: { curso: string; texto: string }[]
}

function ButtonRes({numberVot,numberRes,icon1: Icon1,icon2: Icon2,respostasIcon: RespostasIcon,doubtsList = [],}: PropsButton) {
  const [open, setOpen] = useState<boolean>(false)

  const formattedRes = numberRes.toLocaleString('pt-BR', {
    maximumFractionDigits: 2,
  })

  return (
    <div className="flex gap-2">
      <Badge variant="secondary">
        <button
          className="flex items-center gap-1 hover:text-blue-500"
          onClick={() => setOpen(true)}
        >
          <RespostasIcon size={16} />
          <span>{formattedRes}</span>
        </button>
      </Badge>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full">
            <button className='text-red-500' onClick={() => setOpen(false)}>Fechar</button>

            <DuvidasList doubtsList={doubtsList}/>
          </div>
        </div>
      )}
    </div>
  )
}
export default ButtonRes