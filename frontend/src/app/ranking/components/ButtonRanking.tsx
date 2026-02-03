import { Medal, Trophy } from 'lucide-react'
import React from "react";

interface ButtonProps {
  tipo: "ranking" | "curso";
  setSelected: (tipo: "ranking" | "curso") => void;
}

function ButtonRanking({ tipo, setSelected }: ButtonProps) {
  const icons = {
    ranking: <Trophy className="size-4" />,
    curso: <Medal className="size-4" />
  }

  const titulos = {
    ranking: "Ranking Geral",
    curso: "Meu Curso"
  }

  const handleClick = (e: React.MouseEvent) => {
    if (setSelected) {
      e.preventDefault();
      setSelected(tipo);
    }
  }

  return (
      <button
          type="button"
          onClick={handleClick}
          className="flex items-center gap-2 p-3 rounded-lg
                 hover:bg-b hover:text-yellow-500 dark:hover:text-yellow-500
                 text-foreground dark:text-foreground transition"
      >
        {icons[tipo]}
        <span className="text-sm font-medium">
        {titulos[tipo]}
      </span>
      </button>
  )
}

export default ButtonRanking
