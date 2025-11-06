import { BarChart3, Book, BookOpen, Trophy } from "lucide-react";

interface BlockProps {
    tipo: "duvidas" | "ranking" | "sequencia" | "materias";
    valor: number | string;
}

function Block({ tipo, valor }: BlockProps) {
    const icones = {
        duvidas: <Book className="size-8 text-green-400" />,
        ranking: <Trophy className="size-8 text-yellow-600" />,
        sequencia: <BarChart3 className="size-8 text-blue-600" />,
        materias: <BookOpen className="text-green-600" />
    };


    const titulos = {
        duvidas: "Dúvidas Respondidas",
        ranking: "Posição Ranking",
        sequencia: "Sequência Diária",
        materias: "Materiais Enviados"
    };
    const bgClasses={
        duvidas: "bg-green-50",
        ranking: "bg-yellow-50",
        sequencia: "bg-blue-50",
        materias: "bg-green-50"
    }

    return (
       <div className="bg-white p-6 shadow-sm w-full h-28 rounded-lg ">
            <div className=" flex items-center">
                <div className={`p-3 rounded-lg ${bgClasses[tipo]}`}>
                    {icones[tipo]}
                </div>
                <div className="flex flex-col ml-4">
                    <span className="text-3xl font-bold text-black ">
                        {tipo === "sequencia" ? `${valor} Dias` : valor}
                    </span>
                    <span className="text-gray-500 text-sm whitespace-nowrap m">
                        {titulos[tipo]}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default Block;