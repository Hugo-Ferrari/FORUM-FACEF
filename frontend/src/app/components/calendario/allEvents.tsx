"use client"

import React, { useEffect, useState } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function AllEvents() {
  const [events, setEvents] = useState<{ date: string; title: string }[]>([])

  
  useEffect(() => {
    const stored = localStorage.getItem("events")
    if (stored) {
      setEvents(JSON.parse(stored))
    }
  }, [])

  if (events.length === 0) {
    return (
      <div className="bg-white border p-6 max-w-2xl shadow-md mr-10">
        <h2 className="text-lg font-semibold mb-3">Todos os eventos</h2>
        <p className="text-gray-500">Nenhum evento adicionado ainda.</p>
      </div>
    )
  }

 
  const grouped = events.reduce<Record<string, string[]>>((acc, ev) => {
    if (!acc[ev.date]) acc[ev.date] = []
    acc[ev.date].push(ev.title)
    return acc
  }, {})

  
  const sortedDates = Object.keys(grouped).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  )

  return (
    <div className="bg-white border rounded-xl p-6 w-full sm:w-80 lg:w-96 shadow-md overflow-y-auto max-h-[600px]">
      <h2 className="text-lg font-semibold mb-3">Todos os eventos</h2>

      {sortedDates.map((date) => (
        <div key={date} className="mb-4">
          <h3 className="font-medium text-blue-600">
            {format(new Date(date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </h3>
          <ul className="ml-3 mt-1 space-y-1">
            {grouped[date].map((title, i) => (
              <li
                key={i}
                className="text-sm text-gray-700 bg-blue-50 border border-blue-200 px-2 py-1 rounded-md"
              >
                • {title}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
