"use client"
import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
    Book,
    Calendar,
    CircleStar,
    House,
    MessageSquareText,
    Trophy,
    User,
    PanelLeft, LogOutIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"

type NavItem = {
  href: string
  label: string
  Icon: React.ComponentType<{ size?: number; className?: string }>
}

const navItems: NavItem[] = [
  { href: "/", label: "Início", Icon: House },
  { href: "/curso", label: "Curso", Icon: Book },
  { href: "/chat", label: "Chat Geral", Icon: MessageSquareText },
  { href: "/ranking", label: "Ranking", Icon: Trophy },
  { href: "/hall", label: "Hall da Fama", Icon: CircleStar },
  { href: "/calendario", label: "Calendário", Icon: Calendar },
]

export default function NavLateral() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname() || "/"

  const toggle = () => setOpen((v) => !v)

  return (
    <aside
      aria-label="Navegação lateral"
      className={`fixed top-20 left-0 z-40 h-[calc(100vh-5rem)] bg-white text-black shadow-sm flex flex-col justify-between transition-all duration-300 ease-in-out overflow-hidden ${
        open ? "w-64" : "w-20"
      }`}
    >
      {/* top: logo + toggle (simplified, fewer divs) */}
      <div className="px-2 pt-3">
        {open ? (
          <div className="flex items-center justify-between">
            <div className="h-10 w-36 relative transition-all duration-300 ease-in-out">
              <Image src="/img/Uni-FACEF.png" alt="Uni-FACEF" className="object-contain" fill />
            </div>
            <Button
              onClick={toggle}
              variant="ghost"
              aria-expanded={open}
              aria-label={open ? "Fechar menu" : "Abrir menu"}
              className="flex items-center justify-center w-10 h-10 text-black transition-transform hover:scale-105"
            >
              <PanelLeft className="transform transition-transform duration-300 ease-in-out rotate-0" size={20} />
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <Button
              onClick={toggle}
              variant="ghost"
              aria-expanded={open}
              aria-label={open ? "Fechar menu" : "Abrir menu"}
              className="flex items-center justify-center w-10 h-10 text-black transition-transform hover:scale-105"
            >
              <PanelLeft className="transform transition-transform duration-300 ease-in-out rotate-180" size={20} />
            </Button>
          </div>
        )}
      </div>

       {/* middle: nav items */}
       <nav className="flex-1 mt-4 px-1 overflow-auto">
         <ul className="flex flex-col gap-2">
           {navItems.map(({ href, label, Icon }) => {
             const active = pathname === href
             return (
               <li key={href}>
                 <Link href={href} className={`group flex items-center p-3 rounded-lg transition-colors duration-200 ${
                   active ? "bg-blue-50 text-blue-600" : "hover:bg-[rgba(21,97,183,0.06)] hover:text-blue-600"
                } ${open ? 'gap-3 justify-start pl-3' : 'justify-center'}`}>
                  <span className="flex items-center justify-center w-8">
                    <Icon size={18} className={`${active ? "text-blue-600" : "text-gray-600"} transition-colors duration-200 block`} />
                  </span>
                  <span className={`inline-block text-base truncate transition-all duration-300 ease-in-out transform ${open ? "opacity-100 max-w-full ml-2 translate-x-0" : "opacity-0 max-w-0 -translate-x-2 overflow-hidden"}`}>
                    {label}
                  </span>
                 </Link>
               </li>
             )
           })}
         </ul>
       </nav>

        <div className="p-3 border-t">
          <div className={`flex items-center ${open ? 'justify-between' : 'justify-center'}`}>
             {/* left: avatar + animated user text */}
             <div className={`flex items-center ${open ? 'gap-3' : 'gap-0'}`}>
               <div className="h-10 w-10 flex-shrink-0 bg-gray-500 text-white flex items-center justify-center rounded-full overflow-hidden">
                 <User size={18} />
               </div>

               <div className={`text-sm overflow-hidden transform transition-all duration-200 ease-in-out ${open ? 'max-w-[160px] opacity-100 translate-x-0' : 'max-w-0 opacity-0 -translate-x-2'}`}>
                 <div className="leading-tight">
                   <p className="text-base font-bold">UserName</p>
                   <p className="text-xs">Engenharia de Soft.</p>
                 </div>
               </div>
             </div>

             {/* right: logout button that animates like labels */}
             <div className={`overflow-hidden transform transition-all duration-300 ease-in-out ${open ? 'max-w-[48px] opacity-100 pointer-events-auto' : 'max-w-0 opacity-0 pointer-events-none'}`}>
               <Button variant="ghost" size="icon" onClick={() => {}} className="flex-shrink-0 text-destructive hover:text-destructive">
                 <LogOutIcon />
               </Button>
             </div>
           </div>
         </div>

    </aside>
   )
 }
