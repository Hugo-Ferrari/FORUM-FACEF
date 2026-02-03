import { Scale } from 'lucide-react'
import React from 'react'
const diretrizes = [
    'Seja Respeitoso como todos',
    'Evite spam ou flood',
    'Use @ para mencionar usuarios',
    'Mantenha discussões construtivas',
    'Ajude outros estudantes'
]

function Diretrizes() {
    const listaItens = diretrizes.map((dire, i) =>
        <li className='py-2 list-disc font-medium' key={i}>{dire}</li>
    )
    return (
        <div >
            <div className='flex items-center justify-center gap-2 text-black dark:text-white'>
                <Scale />
                <h1 className='font-semibold text-lg text-black dark:text-white'>Diretrizes</h1>
            </div>
            <ul className='text-black dark:text-white'>
                {listaItens}
            </ul>
        </div>
    )
}

export default Diretrizes