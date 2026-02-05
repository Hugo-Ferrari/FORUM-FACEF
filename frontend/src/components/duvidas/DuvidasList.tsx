"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"
import Usuario from "../user/Usuario"
import ButtonRes from "./ButtonRes"
import { ArrowDown, ArrowUp, MessageCircle } from "lucide-react"

interface DuvidasListProps {
  doubtsList: { curso: string; texto: string }[]
}

function DuvidasList({ doubtsList }: DuvidasListProps) {
  return (
    <div className="mt-3 w-full ml-2 bg-background p-3 ">
      <h2 className="text-xl font-semibold mb-3 text-black dark:text-foreground  ">
        {" "}
        Dúvidas
      </h2>

      {doubtsList.length === 0 ? (
        <p className="text-gray-600 ml-3">Nenhuma dúvida adicionada ainda.</p>
      ) : (
        <div className="max-h-[32vh] overflow-y-auto pr-2 bg-background">
          <ul className="space-y-2">
            {doubtsList.map((item, index) => (
              <li
                key={index}
                className="p-3 bg-muted dark:bg-muted rounded-md shadow-sm hover:bg-muted/70 dark:hover:bg-muted/50"
              >
                <Usuario />
                <div className="flex items-center mt- mb-2 ">
                  <Badge variant="secondary">
                    <strong className="text-blue-600">{item.curso}:</strong>
                  </Badge>
                </div>
                <p className="max-w-full break-words whitespace-pre-wrap">
                  {item.texto}
                </p>
                <ButtonRes
                  icon1={ArrowUp}
                  icon2={ArrowDown}
                  numberVot={1120}
                  numberRes={100}


                
                  respostasIcon={MessageCircle}
                  doubtsList={doubtsList}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default DuvidasList
