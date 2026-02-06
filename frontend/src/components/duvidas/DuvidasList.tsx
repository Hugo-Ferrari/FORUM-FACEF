"use client"

import React, { useState } from "react"
import { Badge } from "@/components/ui/badge"
import Usuario from "../user/Usuario"
import ButtonRes from "./ButtonRes"
import { ArrowDown, ArrowUp, MessageCircle } from "lucide-react"

interface DuvidasListProps {
    doubtsList: { curso: string; texto: string }[]
    type: "modal" | "page"
}

function DuvidasList({ doubtsList, type }: DuvidasListProps) {
  const [openModalIndex, setOpenModalIndex] = useState<number | null>(null);
  const [responseText, setResponseText] = useState("");
  const [responses, setResponses] = useState<{ [key: number]: string[] }>({});

  const handleOpenModal = (index: number) => {
    setOpenModalIndex(index);
    setResponseText("");
  };

  const handleCloseModal = () => {
    setOpenModalIndex(null);
    setResponseText("");
  };

  const handleSendResponse = () => {
    if (openModalIndex === null || responseText.trim() === "") return;
    setResponses(prev => ({
      ...prev,
      [openModalIndex]: [...(prev[openModalIndex] || []), responseText]
    }));
    setResponseText("");
  };

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
                className="p-3 bg-muted dark:bg-muted rounded-md shadow-sm hover:bg-muted/70 dark:hover:bg-muted/50 cursor-pointer"
                onClick={() => handleOpenModal(index)}
              >
                <Usuario />
                <div className="flex items-center mt- mb-2 ">
                  <Badge variant="secondary">
                    <strong className="text-blue-600">{item.curso}</strong>
                  </Badge>
                </div>
                <p className="max-w-full break-words whitespace-pre-wrap">
                  {item.texto}
                </p>
                {openModalIndex === index && (
                  <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
                    <div className="bg-white dark:bg-card p-4 rounded-lg shadow-lg max-w-md w-full">
                      <h3 className="text-lg font-semibold mb-2">Dúvida</h3>
                      <div className="mb-2">
                        <Badge variant="secondary">
                          <strong className="text-blue-600">{item.curso}</strong>
                        </Badge>
                        <p className="mt-2 text-black dark:text-white">{item.texto}</p>
                      </div>
                      <hr className="my-3" />
                      <h4 className="text-md font-semibold mb-2">Respostas</h4>
                      <div className="max-h-32 overflow-y-auto mb-2">
                        {(responses[index] && responses[index].length > 0) ? (
                          <ul className="space-y-1">
                            {responses[index].map((resp, i) => (
                              <li key={i} className="bg-muted p-2 rounded text-black dark:text-white">
                                {resp}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-500">Nenhuma resposta ainda.</p>
                        )}
                      </div>
                      <textarea
                        value={responseText}
                        onChange={e => setResponseText(e.target.value)}
                        placeholder="Digite sua resposta"
                        className="w-full border border-border dark:border-border rounded-md px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-card text-black dark:text-white"
                        rows={3}
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={handleCloseModal}
                          className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                        >
                          Fechar
                        </button>
                        <button
                          onClick={handleSendResponse}
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Enviar resposta
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {type === "page" && (
                  <ButtonRes
                    icon1={ArrowUp}
                    icon2={ArrowDown}
                    numberVot={1120}
                    numberRes={responses[index]?.length || 0}
                    respostasIcon={MessageCircle}
                    doubtsList={doubtsList}
                  />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default DuvidasList
