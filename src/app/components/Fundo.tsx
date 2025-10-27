

import React from 'react';
import Block from './DisplayBlock';
import DuvUsuario from './duvidas/CaixaDuvida';
import Usuario from './user/Usuario';


function Fundo() {

    return (
        <div className='bg-[#EFF0F6] min-h-screen w-full overflow-x-hidden'>
            <div className='flex flex-col items-center p-8 max-w-7xl mx-auto'>
                <h1 className='mt-20 text-black font-extrabold text-5xl'>Bem-Vindo à Comunidade</h1>
                <p className='text-gray-700  mt-4 text-center'>
                    Conecte-se, tire dúvidas, compartilhe conhecimento e cresça junto com seus colegas acadêmicos.
                </p>
                <div className='mt-10 w-full max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
                    <Block tipo = "duvidas" valor = {10}/>
                    <Block tipo = "ranking" valor = "#10"/>
                    <Block tipo = "sequencia" valor = {7}/>
                    <Block tipo = "materias" valor = {27}/>
                </div>
                    <div className='mt-10 w-full'>
                    {/*<DuvUsuario/>*/}
                    <DuvUsuario/>
                    <Usuario/>
                    
                    </div>
                    
            </div>
        </div>
    );
}

export default Fundo;