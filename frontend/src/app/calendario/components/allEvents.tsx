"use client"

import React, { useEffect, useState } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { motion, AnimatePresence } from "framer-motion"
import { CalendarDays, Bookmark, ChevronRight } from "lucide-react"


const typeStyles: Record<string, string> = {
  "Prova": "text-red-500",
  "Apresentação": "text-purple-500",
  "Workshops": "text-green-500",
  "Palestras": "text-blue-500",
  "Default": "text-primary",
};

export default function AllEvents({
  events,
}: {
  events?: { date: string; title: string; type: string }[]
}) {
  const [localEvents, setLocalEvents] = useState<{ date: string; title: string; type: string }[]>(
    events || []
  )

  useEffect(() => {
    if (events) {
      setLocalEvents(events)
      return
    }

    const stored = localStorage.getItem("events")
    if (stored) {
      try {
        setLocalEvents(JSON.parse(stored))
      } catch {
        setLocalEvents([])
      }
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "events") {
        try {
          setLocalEvents(JSON.parse(e.newValue || "[]"))
        } catch {
          setLocalEvents([])
        }
      }
    }

    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [events])

  const grouped = (localEvents || []).reduce<Record<string, { title: string; type: string }[]>>((acc, ev) => {
    if (!acc[ev.date]) acc[ev.date] = []
    acc[ev.date].push({ title: ev.title, type: ev.type })
    return acc
  }, {})

  const sortedDates = Object.keys(grouped).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  )

  return (
    <div className="bg-card/50 backdrop-blur-sm border border-border  p-6 w-full sm:w-80 lg:w-96 shadow-xl shadow-black/5 overflow-hidden flex flex-col max-h-[700px]"
    >
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-gray-300/60 rounded-lg">
          <CalendarDays className="w-5 h-5 text-gray-900" />
        </div>
        <h2 className="text-xl font-black tracking-tight text-foreground uppercase italic">
          Agenda <span className="text-yellow-500">Geral</span>
        </h2>
      </div>

      <div className="overflow-y-auto pr-2 space-y-6 custom-scrollbar">
        {localEvents.length === 0 ? (
          <div className="text-center py-10">
            <Bookmark className="w-8 h-8 text-muted/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Nenhum evento no histórico.</p>
          </div>
        ) : (
          <AnimatePresence>
            {sortedDates.map((date, dateIdx) => (
              <div className="relative pl-4 border-l border-border/60"
              >
                
                <div className="absolute w-2.5 h-2.5 bg-blue-900 rounded-full -left-[5.5px] top-1.5 shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">
                  {format(new Date(date + 'T12:00:00'), "dd 'de' MMM", { locale: ptBR })}
                </h3>

                <ul className="space-y-3">
                  {grouped[date].map((event, i) => (
                    <li
                      key={i}
                      className="group flex flex-col p-3 bg-secondary/30 hover:bg-secondary/50 border border-border/40  transition-all hover:scale-[1.02]"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-background border border-border/50 ${typeStyles[event.type] || typeStyles.Default}`}>
                          {event.type}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-foreground/90 line-clamp-1">
                          {event.title}
                        </p>
                        <ChevronRight className="w-3 h-3 text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}