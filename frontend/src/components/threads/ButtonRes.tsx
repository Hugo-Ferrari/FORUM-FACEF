import { LucideIcon } from 'lucide-react'
import React, { useState } from 'react'
import { Badge } from '../ui/badge'
import DuvidasList from './DuvidasList'

interface PropsButton {
  numberVot: number
  numberRes: number
  icon1: LucideIcon
  icon2: LucideIcon
  respostasIcon: LucideIcon
}

function ButtonRes({
  numberVot,
  numberRes,
  icon1: Icon1,
  icon2: Icon2,
  respostasIcon: RespostasIcon,
}: PropsButton) {

  const [open, setOpen] = useState<boolean>(false)
  const [votes, setVotes] = useState<number>(numberVot)

  const formattedRes = numberRes.toLocaleString('pt-BR')

  return (
    <div className="flex gap-2">

      {/* 🔹 SE NÃO ESTIVER ABERTO → MOSTRA BOTÃO DE COMENTÁRIOS */}
      {!open && (
        <Badge variant="secondary">
          <button
            className="flex items-center gap-1 hover:text-blue-500"
            onClick={() => setOpen(true)}
          >
            <RespostasIcon size={16} />
            <span>{formattedRes}</span>
          </button>
        </Badge>
      )}

      {/* 🔹 SE ESTIVER ABERTO → MOSTRA LIKE E DISLIKE */}
      {open && (
        <>
          <Badge variant="secondary">
            <button
              className="flex items-center gap-1 hover:text-green-500"
              onClick={() => setVotes(v => v + 1)}
            >
              <Icon1 size={16} />
              <span>{votes}</span>
            </button>
          </Badge>

          <Badge variant="secondary">
            <button
              className="flex items-center gap-1 hover:text-red-500"
              onClick={() => setVotes(v => v - 1)}
            >
              <Icon2 size={16} />
            </button>
          </Badge>
        </>
      )}

      {/* 🔹 MODAL */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full">
            <button
              className="text-red-500 mb-2"
              onClick={() => setOpen(false)}
            >
              Fechar
            </button>

            <DuvidasList
              type="modal"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default ButtonRes
