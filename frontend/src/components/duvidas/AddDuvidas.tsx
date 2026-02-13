"use client"

import React, { useState } from "react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select"
import DuvidasList from "./DuvidasList"


interface AddDuvidasProps {
  doubtsList: { curso: string; texto: string }[]
  setDoubtsList: React.Dispatch<React.SetStateAction<{ curso: string; texto: string }[]>>
}

function AddDuvidas({ doubtsList, setDoubtsList }: AddDuvidasProps) {
  const [newDoubt, setNewDoubt] = useState("")
  const [selectedCourse, setSelectedCourse] = useState("")

  const handleAddDoubt = () => {
    if (newDoubt.trim() === "" || selectedCourse === "") {
      alert("Selecione um curso e digite uma dúvida antes de enviar.")
      return
    }

    const newItem = { curso: selectedCourse, texto: newDoubt }
    setDoubtsList([newItem, ...doubtsList])
    setNewDoubt("")
    setSelectedCourse("")
  }

  return (
    <div className="flex flex-col items-start w-150 py-6 gap-4">
      <Popover>
        <PopoverTrigger asChild>
          <button className="bg-blue-600 text-white dark:text-black px-4 py-2 rounded-md hover:bg-blue-700 transition self-center ml-25 -mt-16 ">
            Adicionar Dúvida
          </button>
        </PopoverTrigger>

        <PopoverContent className="w-80 p-4">
          <h2 className="text-lg font-semibold mb-2 text-foreground dark:text-foreground">Nova Dúvida</h2>
    
          <NativeSelect
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="mb-3 w-full text-black ">
              
            <NativeSelectOption value="">Selecione o curso</NativeSelectOption>
            <NativeSelectOption value="Administração">Administração</NativeSelectOption>
            <NativeSelectOption value="Ciência da Computação">Ciência da Computação</NativeSelectOption>
            <NativeSelectOption value="Ciências Contábeis">Ciências Contábeis</NativeSelectOption>
            <NativeSelectOption value="Enfermagem">Enfermagem</NativeSelectOption>
            <NativeSelectOption value="Engenharia Civil">Engenharia Civil</NativeSelectOption>
            <NativeSelectOption value="Engenharia de Produção">Engenharia de Produção</NativeSelectOption>
            <NativeSelectOption value="Engenharia de Software">Engenharia de Software</NativeSelectOption>
            <NativeSelectOption value="Letras">Letras</NativeSelectOption>
            <NativeSelectOption value="Matemática">Matemática</NativeSelectOption>
            <NativeSelectOption value="Medicina">Medicina</NativeSelectOption>
            <NativeSelectOption value="Psicologia">Psicologia</NativeSelectOption>
            <NativeSelectOption value="Publicidade e Propaganda">Publicidade e Propaganda</NativeSelectOption>
            <NativeSelectOption value="Sistemas de Informação">Sistemas de Informação</NativeSelectOption>
          </NativeSelect>

          <input
            value={newDoubt}
            onChange={(e) => setNewDoubt(e.target.value)}
            placeholder="Digite sua dúvida"
            className=" w-full border border-border dark:border-border rounded-md px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-card text-black dark:text-white"
          />

          <div className="flex justify-end">
            <button
              onClick={handleAddDoubt}
              className="bg-blue-600 text-white dark:text-black px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Enviar
            </button>
          </div>
        </PopoverContent>
      </Popover>

      <DuvidasList doubtsList={doubtsList} type={"modal"} />
    </div>
  )
}

export default AddDuvidas
