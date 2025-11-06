import { CircleUserRound } from "lucide-react";


function Usuario() {
    return (
        <div className="flex items-center gap-3">
            <CircleUserRound className="w-10 h-10 text-gray-400" />
            <div >
                <div className="flex items-center gap-2 text-black ">
                    <p className="font-medium">Nome do aluno</p>
                    
                </div>
                <p className="text-sm text-gray-500">Engenharia de Software - 3º ano</p>
            </div>
        </div>
    );
}

export default Usuario;