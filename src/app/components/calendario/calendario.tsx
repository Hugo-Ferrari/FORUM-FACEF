"use client"

import * as React from "react"

import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"

export function Calendario() {
  const [date, setDate] = React.useState<Date | undefined>(new Date(2025, 5, 12))
  const [clicked, setClicked] = React.useState(false)

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
      <div className="">
        <Button
          onClick={() => setClicked(!clicked)}
          className={`transition-colors duration-300 ${clicked ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-200 hover:bg-gray-300"
            }`}
            >
              {clicked?(
                
              <div></div>
              ) : (
                <div className="text-black">

                  <h1>{/* criar fuçao para adicionar uma um novo vento*/}</h1>
                </div>
              )}
              </Button>
          
      </div>
    </div>
  )
}
export default Calendario