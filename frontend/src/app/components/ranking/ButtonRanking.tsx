import { Medal, Trophy } from 'lucide-react'
import Link from 'next/link'

interface ButtonProps {
  tipo: "ranking" | "curso";
}

function ButtonRanking({ tipo }: ButtonProps) {

  const icons = {
    ranking: <Trophy className="size-4" />,
    curso: <Medal className="size-4" />
  }

  const titulos = {
    ranking: "Ranking Geral",
    curso: "Meu Curso"
  }

  const rotas = {
    ranking: "/ranking",
    curso: "/meucurso"
  }

  return (
    <Link href={rotas[tipo]}>
      <button
        type="button"
        className="flex items-center gap-2 p-3 rounded-lg 
                   hover:bg-gray-200 hover:text-yellow-600 
                   text-gray-700 transition"
      >
        {icons[tipo]}
        <span className="text-sm font-medium">
          {titulos[tipo]}
        </span>
      </button>
    </Link>
  )
}

export default ButtonRanking
