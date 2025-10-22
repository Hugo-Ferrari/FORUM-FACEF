import React from 'react'

function NavLateral() {
    return (
        <nav className="w-65 h-screen bg-[#F9F9F9] text-black  flex flex-col justify-between">
            <ul className="space-y-4 mr-auto ml-auto mt-15 pt-20 ">
                <li className="hover:bg-[#1561B7]  p-2 rounded-lg cursor-pointer">Início</li> {/*preciso colocar os simbolos a colocar uma referencia para ser acessado */}
                <li className="hover:bg-[#1561B7]  p-2 rounded-lg cursor-pointer">Curso</li> {/* colocar opacidade no bg */}
                <li className="hover:bg-[#1561B7]  p-2 rounded-lg cursor-pointer">Chat Geral</li>
                <li className="hover:bg-[#1561B7]  p-2 rounded-lg cursor-pointer">Ranking</li>
                <li className="hover:bg-[#1561B7]  p-2 rounded-lg cursor-pointer">Hall da Fama</li>
                <li className="hover:bg-[#1561B7]  p-2 rounded-lg cursor-pointer">Calendário</li>
            </ul>
        </nav>
    )
}

export default NavLateral