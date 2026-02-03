"use client"

import React, { useEffect, useState } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function AllEvents({
  events,
}: {
  events?: { date: string; title: string; type: string }[]
}) {
  // AllEvents now receives `events` optionally; if not provided, it reads from localStorage.
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
  const eventsToShow = localEvents

  if (!eventsToShow || eventsToShow.length === 0) {
    return (
      <div className="bg-white dark:bg-black border p-6 max-w-2xl shadow-md mr-10">
        <h2 className=" text-black dark:text-white text-lg font-semibold mb-3">Todos os eventos</h2>
        <p className="text-gray-500">Nenhum evento adicionado ainda.</p>
      </div>
    )
  }


  const grouped = (eventsToShow || []).reduce<Record<string, { title: string; type: string }[]>>((acc, ev) => {
    if (!acc[ev.date]) acc[ev.date] = []
    acc[ev.date].push({ title: ev.title, type: ev.type })
    return acc
  }, {})


  const sortedDates = Object.keys(grouped).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  )

  return (
    <div className=" border p-6 w-full sm:w-80 lg:w-96 shadow-md overflow-y-auto max-h-[600px] ">
      <h2 className=" text-black dark:text-white text-lg font-semibold mb-3">Todos os eventos</h2>

      {sortedDates.map((date) => (
        <div key={date} className="mb-4">
          <h3 className="font-medium text-blue-600">
            {format(new Date(date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </h3>
          <ul className="ml-3 mt-1 space-y-1">
            {grouped[date].map((event, i) => (
              <li
                key={i}
                className="text-sm text-foreground dark:text-foreground bg-blue-50 dark:bg-muted border border-blue-200 dark:border-border px-2 py-1 "
              >
                • <span className="font-semibold">{event.type}</span> {event.title}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
