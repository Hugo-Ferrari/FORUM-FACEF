"use client"
import { BellIcon, UserRoundIcon, MoonIcon, LogOutIcon, SunIcon, User, Settings } from "lucide-react"
import React, { useEffect, useState } from "react"
import Link from "next/link";
import Image from "next/image";

function Nav() {
  const [openNotification, setOpenNotification] = useState(false)
  const [openMenu, setOpenMenu] = useState(false)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem("theme")
      if (stored === "dark") {
        document.documentElement.classList.add("dark")
        setIsDark(true)
      }
      else if (stored === "light") {
        document.documentElement.classList.remove("dark")
        setIsDark(false)
      }
      else {
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
        if (prefersDark) {
          document.documentElement.classList.add('dark')
          setIsDark(true)
        } else {
          document.documentElement.classList.remove('dark')
          setIsDark(false)
        }
      }
    } catch {
      // ambiente sem browser ou localStorage desabilitado
    }
  }, [])

  const toggleDark = () => {
    const next = !isDark
    setIsDark(next)
    try {
      if (next) {
        document.documentElement.classList.add('dark')
        localStorage.setItem('theme', 'dark')
      } else {
        document.documentElement.classList.remove('dark')
        localStorage.setItem('theme', 'light')
      }
    } catch {
      // ignore
    }
  }

  return (
    <nav className="fixed w-full z-20 top-0 left-0 shadow-xl bg-[#1561B7]">
      <div className="flex items-center justify-between h-20 mx-6 md:mx-10 px-4">
        {/* logo */}
        <Link href="#" className="flex items-center">
          <div className="relative h-12 w-44 md:w-52">
            <Image src="/img/Uni-FACEF.png" alt="Uni-FACEF" className="object-contain" fill />
          </div>
        </Link>

        {/* right controls */}
        <div className="flex items-center gap-2 md:gap-4">
          <ul className="flex items-center p-0 m-0 list-none gap-1 md:gap-2">
            {/* notification*/}
            <li className="relative">
              <button
                onClick={() => setOpenNotification(!openNotification)}
                aria-label="Notificações"
                className="inline-flex items-center justify-center h-10 w-10 rounded-lg text-white hover:bg-white/20 transition-all duration-75"
              >
                <div className="relative">
                  <Link href="#" aria-label="Notificações" className="inline-flex items-center justify-center h-10 w-10 rounded-md text-white hover:bg-white/10 transition-transform duration-200 transform hover:scale-105">
                    <BellIcon className="h-5 w-5 md:h-6 md:w-6 " strokeWidth={1.5} />
                  </Link>


                </div>
              </button>
              {openNotification && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl p-4 space-y-3 animate-in fade-in slide-in-from-top-2">
                  <div className="text-sm font-semibold text-gray-900">Notificações</div>
                  <div className="space-y-2">
                    <div className="p-2 bg-blue-50 rounded border-l-4 border-blue-500 text-sm text-gray-700">
                      Um novo evento foi adicionado!  {/*tenho que integrar com as notifiçãoe que terá no back*/}
                    </div>
                    <div className="p-2 bg-yellow-50 rounded border-l-4 border-yellow-500 text-sm text-gray-700">
                      Nova missão diaria. {/* exmeplos de notificação */}
                    </div>
                  </div>
                  <button className="w-full text-xs text-blue-600 hover:text-blue-700 font-medium py-1">
                    Ver todas
                  </button>
                </div>
              )}
            </li>

            {/* Modo Noturno */}
            <li>
              <button
                onClick={toggleDark}
                aria-label={isDark ? "Desativar modo escuro" : "Ativar modo escuro"}
                aria-pressed={isDark}
                className="inline-flex items-center justify-center h-10 w-10 rounded-lg text-white hover:bg-white/20 transition-all duration-200 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/30"
              >
                {isDark ? <SunIcon className="h-5 w-5 md:h-6 md:w-6" strokeWidth={1.5} /> : <MoonIcon className="h-5 w-5 md:h-6 md:w-6" strokeWidth={1.5} />}
              </button>
            </li>


            {/* Usuário + Menu */}
            <li className="relative">
              <button
                onClick={() => setOpenMenu(!openMenu)}
                className="flex items-center gap-2 md:gap-3 h-10 px-2 md:px-3 rounded-lg hover:bg-white/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/30"
              >
                <div className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-white/20 border border-white/30">
                  <UserRoundIcon className="h-5 w-5 text-white" strokeWidth={1.5} />
                </div>
                <div className="hidden md:flex flex-col leading-tight text-white/95 text-left">
                  <span className="text-sm font-medium">Hugo Ferrari</span>
                  <span className="text-xs opacity-75">Engenharia de Software {/*curso do aluno(englobar com o back)*/}</span>
                </div>
              </button>

              {/* User Menu Dropdown */}
              {openMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-3 border-b bg-gray-50">
                    <h1 className="text-sm font-semibold text-gray-900">Hugo Ferrari</h1>
                    <h1 className="text-xs text-gray-500">usuario@example.com</h1>
                  </div>
                  <div className="p-2 space-y-1">
                    <Link
                      href="/configuracoes"
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded transition-colors"
                    >
                      <Settings className="h-5 w-5" strokeWidth={1.5}/>
                       Configurações
                    </Link>
                    <Link
                      href="/perfil"
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded transition-colors"
                    >
                      <User className = "h-5 w-5" strokeWidth={1.5}/>
                       Perfil
                    </Link>
                  </div>
                  <button
                    onClick={() => {
                      localStorage.removeItem('token')
                      window.location.href = '/'
                    }}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 border-t transition-colors font-medium"
                  >
                    <LogOutIcon className="h-4 w-4" />
                    Sair
                  </button>
                </div>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Nav