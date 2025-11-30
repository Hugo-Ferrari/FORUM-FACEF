"use client"

import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import AllEvents from "./allEvents"

export function Calendario() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const [events, setEvents] = React.useState<{ date: string; title: string }[]>([])
  const [newEvent, setNewEvent] = React.useState("")
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)

  const selectedDateStr = date ? date.toISOString().split("T")[0] : ""

  React.useEffect(() => {
    const stored = localStorage.getItem("events")
    if (stored) {
      setEvents(JSON.parse(stored))
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "events") {
        try {
          setEvents(JSON.parse(e.newValue || "[]"))
        } catch {
          //ignore quando der erro
        }
      }
    }
    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [])

  React.useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events))
  }, [events])

  const handleAddEvent = () => {
    if (!date || !newEvent.trim())
      return alert("Selecione uma data e digite um evento.")
    const newItem = { date: selectedDateStr, title: newEvent.trim() }
    setEvents([...events, newItem])
    setNewEvent("")
    setIsDialogOpen(false)
  }

  const dayEvents = events.filter((e) => e.date === selectedDateStr)

  return (
    <div className="flex gap-5 ml-10 mt-5 items-start">
      <div>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className=" border w-125"
        />
      </div>

      <div className="bg-white border p-6 w-full sm:w-80 shadow-md ">
        <h2 className="text-lg font-semibold mb-3">
          {date
            ? `Eventos em ${date.toLocaleDateString("pt-BR")}`
            : "Selecione uma data"}
        </h2>

        {dayEvents.length === 0 ? (
          <p className="text-gray-500 mb-4">Nenhum evento nesta data.</p>
        ) : (
          <div className="max-h-[36vh] overflow-y-auto mb-4 pr-2">
            <ul className="space-y-2">
            {dayEvents.map((ev, index) => (
              <li
                key={index}
                className="bg-blue-50 border border-blue-200 text-blue-700 px-3 py-2 text-sm"
              >
                • {ev.title}
              </li>
            ))}
            </ul>
          </div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              Adicionar Evento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Adicionar Evento</DialogTitle>
            </DialogHeader>
            <Input
              placeholder="Digite o nome do evento"
              value={newEvent}
              onChange={(e) => setNewEvent(e.target.value)}
              className="mt-3"
            />
            <Button
              onClick={handleAddEvent}
              className="mt-4 bg-blue-600 hover:bg-blue-700 w-full"
            >
              Salvar
            </Button>
          </DialogContent>
        </Dialog>
      </div>
      <AllEvents events={events} />
    </div>
  )
}

export default Calendario
