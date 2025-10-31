"use client"

import * as React from "react"

import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import AddEvents from "./addEvents"

export function Calendario() {
  const [date, setDate] = React.useState<Date | undefined>(new Date(2025, 5, 12))
  

  return (
    <div className=" ml-10 mt-5 flex">
      <div >
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className=" rounded-lg border w-3xl [--cell-size:--spacing(11)] md:[--cell-size:--spacing(12)] "
          buttonVariant="ghost"


        />
      </div>
     <div>
      <AddEvents/>
     </div>
    </div>
  )
}
export default Calendario