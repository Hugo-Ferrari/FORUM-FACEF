"use client"
import React, { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Book,
  Calendar,
  CircleStar,
  House,
  MessageSquareText,
  Trophy,
  PanelLeft, TrophyIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Item, ItemContent, ItemFooter, ItemHeader, ItemSeparator, ItemTitle } from "@/components/ui/item";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

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
  const [open, setOpen] = useState(true)
  const pathname = usePathname() || "/"

  const toggle = () => setOpen((v) => !v)

  // publish the sidebar width as a CSS variable so layout/content can adapt
  useEffect(() => {
    const width = open ? "18rem" : "5rem" // w-72 = 18rem, w-20 = 5rem
    try {
      document.documentElement.style.setProperty("--sidebar-width", width)
    } catch {
      // server-side or other environments may fail; ignore
    }
  }, [open])

  return (
    <aside
      aria-label="Navegação lateral"
      className={`fixed top-20 left-0 z-40 h-[calc(100vh-5rem)] bg-white text-black shadow-sm flex flex-col justify-between transition-all duration-300 ease-in-out overflow-hidden ${open ? "w-65" : "w-20"
        }`}
    >
      {/* top: logo + toggle (simplified, fewer divs) */}
      <div className="px-2 pt-3">
        <div className={`flex items-center ${open ? 'justify-end' : "justify-center"} duration-300 ease-in-out`}>
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
      </div>

      {/* middle: nav items */}
      <nav className="flex-1 mt-4 px-4">
        <ul className="flex flex-col gap-2">
          {navItems.map(({ href, label, Icon }) => {
            const active = pathname === href
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`group flex items-center h-10 px-3 rounded-lg transition-colors duration-200 ${active ? "bg-blue-50 text-blue-600 font-semibold" : "hover:bg-[rgba(21,97,183,0.06)] hover:text-blue-600"
                    } ${open ? 'gap-3 justify-start' : 'justify-center'}`}
                >
                  <span className="flex items-center justify-center w-8 flex-shrink-0">
                    <Icon size={18} className={`${active ? "text-blue-600" : "text-gray-600"} transition-colors duration-200 block`} />
                  </span>

                  <span
                    className={`inline-block text-base truncate transition-all duration-300 ease-in-out transform ${open ? "opacity-100 max-w-[160px] ml-2 translate-x-0" : "opacity-0 max-w-0 -translate-x-2 overflow-hidden"
                      }`}
                  >
                    {label}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {open && (
        <div className="flex-shrink-0 px-4 py-2">
          <Item variant={"muted"} className={"border border-gray-200"}>
            <ItemHeader>
              <ItemTitle>
                <TrophyIcon className={"text-blue-400"} />
                <span className="ml-2 text-lg">Missões Semanais</span>
              </ItemTitle>
            </ItemHeader>
            <ItemContent className={"flex flex-col gap-6"}>
              <div className={"flex flex-col gap-2 items-center w-full"}>
                <div className={"flex justify-between items-center w-full"}>
                  <p>
                    Responda 3 dúvidas
                  </p>
                  <Badge className={"bg-white border border-gray-400 text-black"}>
                    2 / 3
                  </Badge>
                </div>
                <Progress value={66} className={"w-full "} />
              </div>
              <div className={"flex flex-col gap-2 items-center w-full"}>
                <div className={"flex justify-between items-center w-full"}>
                  <p>
                    Responda 5 dúvidas
                  </p>
                  <Badge className={"bg-white border border-gray-400 text-black"}>
                    5 / 5
                  </Badge>
                </div>
                <Progress value={100} className={"w-full "} />
              </div>
              <div className={"flex flex-col gap-2 items-center w-full"}>
                <div className={"flex justify-between items-center w-full"}>
                  <p>
                    Responda 2 dúvidas
                  </p>
                  <Badge className={"bg-white border border-gray-400 text-black"}>
                    0 / 2
                  </Badge>
                </div>
                <Progress value={0} className={"w-full "} />
              </div>
            </ItemContent>
            <ItemSeparator />
            <ItemFooter>
              <span>Progresso Semanal</span>
              <Badge className={"bg-blue-500 "}>
                75%
              </Badge>
            </ItemFooter>
          </Item>
        </div>
      )}

    </aside>
  )
}
