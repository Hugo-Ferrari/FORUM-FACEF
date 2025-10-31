import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import React, { useState } from 'react'

function AddEvents() {
  const [eventList, setEventList] = useState<{ evento: string; texto: string }[]>([])
  const [newEvent, setNewEvent] = useState("")
  const [selectEvente, setSelectedEvent] = useState("")

  const handleAddEvent = () => {
    if (newEvent.trim() === "" || selectEvente === "") {
      alert("Selecione o tipo de evento e escreva o seu evento.")
      return
    }

    const newItem = { evento: selectEvente, texto: newEvent }
    setEventList([...eventList, newItem])
    setNewEvent("")
    setSelectedEvent("")
  }

  return (
    <div className="flex flex-col items-start w-full ml-2 mt-1 gap-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button className='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition'>Adicionar novo Evento</Button>
        </PopoverTrigger>

        <PopoverContent className="ml-27 ">
          <h2 className=" text-lg font-semibold mb-2">Novo Evento</h2>

          <NativeSelect
            value={selectEvente}
            onChange={(e) => setSelectedEvent(e.target.value)}
            className='mb-3 w-full '
          >
            <NativeSelectOption value="">Selecione o Evento</NativeSelectOption>
            <NativeSelectOption value="provas">Provas</NativeSelectOption>
            <NativeSelectOption value="palestras">Palestras</NativeSelectOption>
            <NativeSelectOption value="feira de profissoes">Feira de Profissão</NativeSelectOption>
            <NativeSelectOption value="apresentacao de tip">Apresentação de Tip</NativeSelectOption>
            <NativeSelectOption value="apresentacao de tcc">Apresentação de TCC</NativeSelectOption>
            <NativeSelectOption value="apresentacao de artigo">Apresentação de Artigo</NativeSelectOption>
          </NativeSelect>

          <Input
            value={newEvent}
            onChange={(e) => setNewEvent(e.target.value)}
            placeholder="Digite o novo evento"
            className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
          />

          <div className="flex  ">
            <Button onClick={handleAddEvent}
            className='mt-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition'>Enviar</Button>
          </div>
        </PopoverContent>
      </Popover>


      <div className="mt-4 w-full">
        <h2 className="font-semibold text-xl mb-2">Eventos</h2>
        {eventList.length === 0 ? (
          <p className='text-gray-500'>Nenhum evento encontrado</p>
        ) : (
          <ul className="space-y-2">
            {eventList.map((item, index) => (
              <li key={index}
              className=' bg-gray-100 rounded-mb shadow-sm hover:bg-gray-200 p-2'>
                <div className='flex flex-col mb-1 '>
                  <Badge variant="secondary" className='text-sm'>
                <strong className="text-blue-600 ">{item.evento}:</strong>
                  </Badge>
                </div>
                <div className='ml-2'>

                 {item.texto}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default AddEvents
