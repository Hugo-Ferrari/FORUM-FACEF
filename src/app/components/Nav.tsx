import React from 'react'

function Nav() {
    return (
        <nav className='fixed w-full z-20 top-0 start-0  shadow-xl bg-[#1561B7]'>
            <div className=' flex items-center justify-between mx-auto p-4'>

                <a href="/" className='flex items-center space-x-3 rtl:space-x-reverse '>

                    <img src="/img/Uni-FACEF.png" alt="Uni-FACEF" className="h-10 w-auto " />

                </a>


                <div className='flex items-center justify-end md:order-1'>
                    <ul className='flex p-0 font-medium space-x-10 rtl:space-x-reverse'>


                        <li>
                            <a
                                href="#"
                                className='block py-2 px-3 text-white '
                            >
                                <img src="/img/notificacao.png" alt="notificação" className='h-8 w-auto' />
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className='block py-2 px-3 text-white '
                            >
                                <img src="/img/lua.png" alt="lua" className='h-8 w-auto' />
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className='flex py-2 px-3 text-white space-x-3'
                            >


                                <img src="/img/usuario.png" alt="Perfil" className='h-10 w-auto' />
                                <div className='flex flex-col leading-tight'>
                                    <p className=''>Nome do aluno</p>
                                    <p className='text-sm opacity-80 -mt-1'>curso do aluno</p>
                                </div>
                            </a>
                        </li>

                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Nav