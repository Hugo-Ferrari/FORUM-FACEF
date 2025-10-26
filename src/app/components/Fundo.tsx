

import React, { JSX } from 'react';
import Block from './Block';
import DuvUsuario from './CaixaDuvida';

interface FundoProps {
    indicadores: Record<string, number | string | undefined | null>;
}


function Fundo({ indicadores }: FundoProps): JSX.Element {

    return (

        <div className='bg-[#EFF0F6] min-h-screen'>

            <div className='flex flex-col justify-center items-center p-8'>
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
                    <div className='mt-6 w-full'>
                    <DuvUsuario/>
                    {/*função para ver todas as duvidas*/}
                    </div>
                    
            </div>
        </div>
    );
}

export default Fundo;