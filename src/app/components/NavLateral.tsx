import React from 'react'

function NavLateral() {
    return (
        <nav className="w-45 h-screen bg-[#F9F9F9] text-black  flex flex-col justify-between">
            <ul className="space-y-4 mr-auto ml-auto mt-15 pt-20 ">
                <li className="hover:bg-[rgba(21,97,183,0.2)] transition-colors duration-200 p-2 rounded-lg cursor-  hover:text-blue-500">Início</li> {/*preciso colocar os simbolos a colocar uma referencia para ser acessado */}
                <li className="hover:bg-[rgba(21,97,183,0.2)] transition-colors duration-200 p-2 rounded-lg cursor-  hover:text-blue-500">Curso</li> {/* colocar opacidade no bg */}
                <li className="hover:bg-[rgba(21,97,183,0.2)] transition-colors duration-200 p-2 rounded-lg cursor-  hover:text-blue-500">Chat Geral</li>
                <li className="hover:bg-[rgba(21,97,183,0.2)] transition-colors duration-200 p-2 rounded-lg cursor-  hover:text-blue-500">Ranking</li>
                <li className="hover:bg-[rgba(21,97,183,0.2)] transition-colors duration-200 p-2 rounded-lg cursor-  hover:text-blue-500">Hall da Fama</li>
                <li className="hover:bg-[rgba(21,97,183,0.2)] transition-colors duration-200 p-2 rounded-lg cursor-  hover:text-blue-500">Calendário</li>
            </ul>
        </nav>
    )
}

export default NavLateral