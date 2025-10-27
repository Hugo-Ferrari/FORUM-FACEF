"use client"
import { Book, Calendar, CircleStar, House, Logs, Menu, MessageSquareText, Trophy } from 'lucide-react'
import React, { useState } from 'react'
function NavLateral() {
    const [open, setOpen] = useState(false)
    const handClick = () => {
        setOpen(!open)
    }
    return (
        <div>
            {!open && (
                <div className="fixed top-20 bg-white z-40 flex flex-col h-full items-center p-2 text-black px-3 py-20 transition-all duration-300 gap-5 ">
                    <button
                        onClick={handClick}
                        className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-full hover:bg-blue-700 transition-transform hover:scale-110">
                        <Menu size={20} className='text-white' />
                    </button>


                    <div className="flex flex-col items-center space-y-4 gap-5">
                        <a href="#"><span className="hover:text-blue-600 transition"><House size={20} /></span></a>
                        <a href="#"><span className="hover:text-blue-600 transition"><Book size={20} /></span></a>
                        <a href="#"><span className="hover:text-blue-600 transition"><MessageSquareText size={20} /></span></a>
                        <a href="#"><span className="hover:text-blue-600 transition"><Trophy size={20} /></span></a>
                        <a href="#"><span className="hover:text-blue-600 transition"><CircleStar size={20} /></span></a>
                        <a href="#"><span className="hover:text-blue-600 transition"><Calendar size={20} /></span></a>
                    </div>
                </div>
            )}
            <nav className={` bg-white h-full  z-40 fixed top-20 left-0 w-64 text-black  transform transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"}`}>
                <button
                    onClick={handClick}
                    className="absolute top-20 left-4 text-gray-600 hover:text-blue-600 transition p-2 rounded-md">
                    <Logs size={22} />
                </button>
                 <ul className="space-y-4 ml-3 mt-12 gap-5 pt-20"> {/* Aumentei space-y-8 e gap-8 */}
        <a href='#'>
            <li className="hover:bg-[rgba(21,97,183,0.2)] transition-colors duration-200 p-4 rounded-lg cursor-pointer hover:text-blue-600 flex gap-3">
                <House size={20} />
                <span className="text-base">Início</span>
            </li>
        </a>
        <a href='#'>
            <li className="hover:bg-[rgba(21,97,183,0.2)] transition-colors duration-200 p-4 rounded-lg cursor-pointer hover:text-blue-600 flex gap-3">
                <Book size={20} />
                <span className="text-base">Curso</span>
            </li>
        </a>
        <a href='#'>
            <li className="hover:bg-[rgba(21,97,183,0.2)] transition-colors duration-200 p-4 rounded-lg cursor-pointer hover:text-blue-600 flex gap-3">
                <MessageSquareText size={20} />
                <span className="text-base">Chat Geral</span>
            </li>
        </a>
        <a href='#'>
            <li className="hover:bg-[rgba(21,97,183,0.2)] transition-colors duration-200 p-4 rounded-lg cursor-pointer hover:text-blue-600 flex gap-3">
                <Trophy size={20} />
                <span className="text-base">Ranking</span>
            </li>
        </a>
        <a href='#'>
            <li className="hover:bg-[rgba(21,97,183,0.2)] transition-colors duration-200 p-4 rounded-lg cursor-pointer hover:text-blue-600 flex gap-3">
                <CircleStar size={20} />
                <span className="text-base">Hall da Fama</span>
            </li>
        </a>
        <a href='#'>
            <li className="hover:bg-[rgba(21,97,183,0.2)] transition-colors duration-200 p-4 rounded-lg cursor-pointer hover:text-blue-600 flex gap-3">
                <Calendar size={20} />
                <span className="text-base">Calendário</span>
            </li>
        </a>
    </ul>
            </nav>
        </div>
    )
}

export default NavLateral