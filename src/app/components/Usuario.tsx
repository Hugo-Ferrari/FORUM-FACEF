import { CircleUserRound } from "lucide-react"


function Usuario() {
    //temos que ligar o  login de usuario com esse componente
    return (
        <div className="flex">
            <CircleUserRound className="w-auto size-8"/>
            <div className=' leading-tight ml-3'>
                <p className=''>Nome do aluno{/*Nome do aluno*/}</p>
                <p className='text-sm opacity-80 -mt-1'> Engenharia de Software {/*curso do aluno*/} - 3º ano{/*ano do aluno*/}</p>
            </div>
        </div>
    )
}
export default Usuario