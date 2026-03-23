"use client"

import * as React from "react"
import { AnimatePresence } from "framer-motion"
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
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { Plus, Clock, MapPin, Info, Hammer, LucideIcon, MicVocal, NotebookPen, PartyPopper, Mic } from "lucide-react"
import AllEvents from "./components/allEvents"


interface Evento {
  date: string
  title: string
  type: string
  location: string
}

const typeStyles: Record<string, { color: string; icon: LucideIcon }> = {
  "Prova": { color: "bg-red-500/10 text-red-500 border-red-500/20", icon: NotebookPen },
  "Apresentação": { color: "bg-purple-500/10 text-purple-500 border-purple-500/20", icon: MicVocal },
  "Workshops": { color: "bg-green-500/10 text-green-500 border-green-500/20", icon: Hammer },
  "Palestras": { color: "bg-blue-500/10 text-blue-500 border-blue-500/20", icon: Mic },
  "Default": { color: "bg-primary/10 text-primary border-primary/20", icon: PartyPopper },
};

export function Calendario() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const [events, setEvents] = React.useState<Evento[]>([])
  const [newEvent, setNewEvent] = React.useState("")
  const [newLocation, setNewLocation] = React.useState("") // Novo estado para local
  const [selectedEvent, setSelectedEvent] = React.useState("")
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)

  const selectedDateStr = date ? date.toISOString().split("T")[0] : ""

  React.useEffect(() => {
    const stored = localStorage.getItem("events")
    if (stored) setEvents(JSON.parse(stored))

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "events") {
        try { setEvents(JSON.parse(e.newValue || "[]")) } catch { }
      }
    }
    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [])

  React.useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events))
  }, [events])

  const handleAddEvent = () => {
    if (!date || !newEvent.trim() || !selectedEvent || !newLocation.trim())
      return alert("Preencha todos os campos, incluindo o local.")

    const newItem: Evento = { 
        date: selectedDateStr, 
        title: newEvent.trim(), 
        type: selectedEvent,
        location: newLocation.trim() // Salvando o local
    }
    
    setEvents([...events, newItem])
    setNewEvent("")
    setNewLocation("") // Limpa o campo
    setSelectedEvent("")
    setIsDialogOpen(false)
  }

  const dayEvents = events.filter((e) => e.date === selectedDateStr)

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">

        {/* Lado Esquerdo */}
        <div className="w-full lg:w-fit space-y-6">
          <div className="bg-card border border-border p-4 shadow-sm min-w-100 h-100"
          >
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md w-full h-full"
            />
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full py-6 bg-blue-600 font-display font-bold text-lg gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform rounded-2xl">
                <Plus className="w-5 h-5" /> Novo Evento
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md border-border rounded-3xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black text-blue-600">Agendar Evento</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <NativeSelect
                  value={selectedEvent}
                  onChange={(e) => setSelectedEvent(e.target.value)}
                  className="w-full bg-muted/50 border-none h-12"
                >
                  <NativeSelectOption value="">Selecione o Tipo</NativeSelectOption>
                  <NativeSelectOption value="Prova">Prova</NativeSelectOption>
                  <NativeSelectOption value="Apresentação">Apresentação</NativeSelectOption>
                  <NativeSelectOption value="Workshops">Workshops</NativeSelectOption>
                  <NativeSelectOption value="Palestras">Palestras</NativeSelectOption>
                </NativeSelect>
                
                <Input
                  placeholder="Título do evento..."
                  value={newEvent}
                  onChange={(e) => setNewEvent(e.target.value)}
                  className="h-12 bg-muted/50 border-none focus-visible:ring-blue-600/20"
                />

                
                <Input
                  placeholder="Local (Ex: Sala 204, Auditório...)"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="h-12 bg-muted/50 border-none focus-visible:ring-blue-600/20"
                />

                <Button onClick={handleAddEvent} className="w-full h-12 font-bold bg-blue-600 hover:bg-blue-700 text-md rounded-xl">
                  Confirmar Agendamento
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Lado Direito */}
        <div className="flex-1">
          <div className="mb-8"
          >
            <h1 className="font-display font-black text-4xl text-foreground uppercase italic">
              Eventos de <span className="text-blue-600">
                {date ? date.toLocaleDateString("pt-BR", { day: '2-digit', month: 'short' }) : "Hoje"}
              </span>
            </h1>
            <p className="text-muted-foreground mt-1 font-medium">Visualize seus compromissos para esta data específica.</p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <AnimatePresence mode="popLayout">
              {dayEvents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-muted rounded-3xl"
                >
                  <Info className="w-10 h-10 text-gray-300 mb-3" />
                  <p className="text-muted-foreground font-medium text-lg uppercase italic">Nada planejado para este dia.</p>
                </div>
              ) : (
                dayEvents.map((ev, i) => {
                  const style = typeStyles[ev.type] || typeStyles["Default"];
                  return (
                    <div className="bg-card border border-border overflow-hidden flex group hover:border-blue-600/30 transition-all shadow-sm rounded-2xl"
                    >
                      <div className={`w-20 ${style.color.split(' ')[0]} flex flex-col items-center justify-center shrink-0 border-r border-border/50`}>
                        <style.icon className="w-7 h-7 mb-1" />
                        <span className="font-display font-black text-xl leading-none">
                          {new Date(ev.date + 'T12:00:00').getDate()}
                        </span>
                      </div>

                      <div className="p-5 flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${style.color}`}>
                            {ev.type}
                          </span>
                        </div>
                        <h3 className="font-display font-bold text-xl text-foreground group-hover:text-blue-600 transition-colors uppercase italic leading-tight">
                          {ev.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-muted-foreground font-bold uppercase tracking-tight">
                          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-blue-600" /> Todo o dia</span>
                          
                          <span className="flex items-center gap-1.5 text-foreground">
                            <MapPin className="w-3.5 h-3.5 text-blue-600" /> 
                            {ev.location}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="hidden xl:block w-80">
          <AllEvents events={events} />
        </div>
      </div>
    </div>
  )
}

export default Calendario