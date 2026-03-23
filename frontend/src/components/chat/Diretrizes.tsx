"use client"
import React from 'react'
import { Scale, ShieldCheck, MessageSquare, AtSign, Zap, Heart } from 'lucide-react'


const diretrizes = [
    { text: 'Seja respeitoso com todos', icon: <Heart className="w-4 h-4 text-red-500" /> },
    { text: 'Evite spam ou flood', icon: <Zap className="w-4 h-4 text-yellow-500" /> },
    { text: 'Use @ para mencionar usuários', icon: <AtSign className="w-4 h-4 text-blue-500" /> },
    { text: 'Discussões construtivas', icon: <MessageSquare className="w-4 h-4 text-green-500" /> },
    { text: 'Ajude outros estudantes', icon: <ShieldCheck className="w-4 h-4 text-primary" /> }
]

function Diretrizes() {
    return (
        <div className="bg-card/30 border border-border rounded-2xl p-5 shadow-sm">
            
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-primary/10 p-2 rounded-lg text-primary">
                    <Scale className="w-5 h-5" />
                </div>
                <div>
                    <h2 className="font-bold text-foreground leading-none">Regras da Casa</h2>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1 font-medium">Comunidade Uni-FACEF</p>
                </div>
            </div>

            
            <ul className="space-y-4">
                {diretrizes.map((dire, i) => (
                    <li className="flex items-start gap-3 group"
                    >
                        <div className="mt-0.5 opacity-80 group-hover:opacity-100 transition-opacity">
                            {dire.icon}
                        </div>
                        <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors leading-tight">
                            {dire.text}
                        </span>
                    </li>
                ))}
            </ul>

            
            <div className="mt-6 pt-4 border-t border-border/50 text-center">
                <p className="text-[11px] text-muted-foreground italic">
                    O descumprimento pode levar à suspensão do acesso ao chat.
                </p>
            </div>
        </div>
    )
}

export default Diretrizes