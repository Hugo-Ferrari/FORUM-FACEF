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
    const listaItens = diretrizes.map(dire =>
        <li className='py-2 list-disc font-medium'>{dire}</li>
    )
    return (
        <div >
            <div className='flex items-center justify-center gap-2'>
                <Scale />
                <h1 className='font-semibold text-lg'>Diretrizes</h1>
            </div>
            <ul >
                {listaItens}
            </ul>
        </div>
    )
}

export default Diretrizes