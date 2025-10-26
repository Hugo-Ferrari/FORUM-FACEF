"use client"
import { Book, Calendar, CircleStar, House, Logs, Menu, MessageSquareText, Trophy } from 'lucide-react'
import React, { useState } from 'react'
function NavLateral() {
    const [abrir, setAbrir] = useState(false)
    const handclick = () => {
        setAbrir(!abrir)
    }
    return (
        <div>
            <button onClick={handclick}
                className="fixed top-20 left-5 z-50 flex items-center gap-2 bg-blue-700 text-white px-4 py-2 rounded-full shadow-md hover:bg-blue-700 hover:scale-105 transition-all duration-300">
                {abrir ?  <Logs/> : <Menu/> }
            </button>
            <nav className={` z-40 fixed top-0 left-0 h-full w-64 text-black p-6 transform transition-transform duration-300 ${abrir ? "translate-x-0" : "-translate-x-full"}`}>
                <ul className="space-y-4 mr-auto ml-auto mt-15 pt-20 ">
                    <li className="hover:bg-[rgba(21,97,183,0.2)] transition-colors duration-200 p-2 rounded-lg cursor-  hover:text-blue-500 flex gap-1"><House size={20}/>Início</li> 
                    <li className="hover:bg-[rgba(21,97,183,0.2)] transition-colors duration-200 p-2 rounded-lg cursor-  hover:text-blue-500 flex gap-1"> <Book size={20}/>Curso</li> 
                    <li className="hover:bg-[rgba(21,97,183,0.2)] transition-colors duration-200 p-2 rounded-lg cursor-  hover:text-blue-500 flex gap-1"><MessageSquareText size={20}/>Chat Geral</li>
                    <li className="hover:bg-[rgba(21,97,183,0.2)] transition-colors duration-200 p-2 rounded-lg cursor-  hover:text-blue-500 flex gap-1"><Trophy size={20}/>Ranking</li>
                    <li className="hover:bg-[rgba(21,97,183,0.2)] transition-colors duration-200 p-2 rounded-lg cursor-  hover:text-blue-500 flex gap-1"><CircleStar size={20}/>Hall da Fama</li>
                    <li className="hover:bg-[rgba(21,97,183,0.2)] transition-colors duration-200 p-2 rounded-lg cursor-  hover:text-blue-500 flex gap-1"><Calendar size={20}/>Calendário</li>
                    
                </ul>
            </nav>
        </div>
    )
}

export default NavLateral