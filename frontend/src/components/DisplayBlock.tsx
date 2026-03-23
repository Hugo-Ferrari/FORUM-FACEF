"use client"

import { BarChart3, Book, BookOpen, MenuSquare, MessageSquareMore, Trophy, Zap } from "lucide-react"; // Adicionado Zap


export interface BlockProps {
    tipo: "duvidas" | "ranking" | "sequencia" | "materias" | "xp" | "respostas" ; 
    valor: number | string;
    index?: number;
}

function Block({ tipo, valor, index = 0 }: BlockProps) {
    const icones = {
        duvidas: <Book className="size-6 text-emerald-500" />,
        ranking: <Trophy className="size-6 text-amber-500" />,
        sequencia: <BarChart3 className="size-6 text-blue-500" />,
        materias: <BookOpen className="size-6 text-purple-500" />,
        respostas: <MessageSquareMore className="size-6 text-amber-500"/>,
        xp: <Zap className="size-6 text-yellow-500" /> 

    };

    const titulos = {
        duvidas: "Dúvidas ",
        ranking: "Posição Ranking",
        sequencia: "Sequência Diária",
        materias: "Materiais Enviados",
        respostas: "Duvidas respondidas",
        xp: "XP Acumulado"
        
    };

    const bgClasses = {
        duvidas: "bg-emerald-500/10",
        ranking: "bg-amber-500/10",
        sequencia: "bg-blue-500/10",
        materias: "bg-purple-500/10",
        xp: "bg-yellow-500/10"
    };

    // Formatação para números grandes (ex: 1500 -> 1.5k)
    const formatarValor = (val: number | string) => {
        if (typeof val === 'number' && val >= 1000) {
            return `${(val / 1000).toFixed()}k `;
        }
        return val;
    };

    return (
        <div className="bg-card border border-border p-5  shadow-sm hover:shadow-md transition-all w-full h-28 flex items-center relative overflow-hidden group">
            
            <div className={`absolute -right-4 -top-4 w-20 h-20 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity ${bgClasses[tipo as keyof typeof bgClasses]}`} />

            <div className="flex items-center w-full z-10">
                <div className={`p-4 rounded-xl ${bgClasses[tipo as keyof typeof bgClasses]} shrink-0 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    {icones[tipo as keyof typeof icones]}
                </div>
                
                <div className="flex flex-col ml-4 overflow-hidden">
                    <span className="text-3xl font-black text-foreground leading-tight italic uppercase tracking-tighter"
                        >
                        {tipo === "sequencia" ? `${valor} Dias` : formatarValor(valor)}
                    </span>
                    <span className="text-[10px] uppercase tracking-widest font-black text-muted-foreground/70 truncate">
                        {titulos[tipo as keyof typeof titulos]}
                    </span>
                </div>
            </div>
            </div>
        
    );
}

export default Block;