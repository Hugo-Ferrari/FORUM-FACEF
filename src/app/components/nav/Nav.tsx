import {BellIcon, UserRoundIcon, MoonIcon, LogOutIcon} from "lucide-react"
import React from "react"
import Link from "next/link";
import Image from "next/image";
import {Button} from "@/components/ui/button";

function Nav() {
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
                <div className="flex items-center gap-3 md:gap-6">
                    <ul className="flex items-center p-0 m-0 list-none gap-2 md:gap-4">
                        <li>
                            <Link href="#" aria-label="Notificações" className="inline-flex items-center justify-center h-10 w-10 rounded-md text-white hover:bg-white/10 transition-transform duration-200 transform hover:scale-105">
                                <BellIcon className="h-6 w-6 md:h-7 md:w-7" strokeWidth={1} />
                            </Link>
                        </li>

                        <li>
                            <Link href="#" aria-label="Modo noturno" className="inline-flex items-center justify-center h-10 w-10 rounded-md text-white hover:bg-white/10 transition-transform duration-200 transform hover:scale-105">
                                <MoonIcon className="h-6 w-6 md:h-7 md:w-7" strokeWidth={1} />
                            </Link>
                        </li>

                        <li className="relative">
                            {/* user area: avatar + info + logout */}
                            <div className="flex items-center gap-3 md:gap-4 pr-1">
                                <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-white/10">
                                    <UserRoundIcon className="h-6 w-6 md:h-7 md:w-7 text-white" strokeWidth={1} />
                                </div>
                                <div className="hidden md:flex flex-col leading-tight text-white/95 transition-all duration-300 ease-in-out overflow-hidden overflow-ellipsis max-w-[140px]">
                                    <span className="text-sm font-medium">Hugo Ferrari</span>
                                    <span className="text-xs opacity-80 -mt-1 w-[75%] truncate">Engenharia de Software</span>
                                </div>
                            </div>

                            {/* logout animated like sidebar */}
                            <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
                                <div className="overflow-hidden transform transition-all duration-300 ease-in-out max-w-[48px] opacity-100 pointer-events-auto">
                                    <Button variant="ghost" size="icon" className="flex-shrink-0 text-destructive hover:text-destructive">
                                        <LogOutIcon />
                                    </Button>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Nav