import React from 'react'
import { Badge } from '@/components/ui/badge'
import { ItemTitle } from '@/components/ui/item'
import { User } from 'lucide-react'

type ChatHeaderProps = {
    title: string
    isConnected: boolean
    userName: string
}

/**
 * Componente de cabeçalho do chat
 *
 * Responsabilidades:
 * - Exibir título do chat
 * - Mostrar status de conexão (badge verde/vermelho)
 * - Exibir nome do usuário logado (apenas visualização)
 *
 * @param title - Título do chat
 * @param isConnected - Status da conexão
 * @param userName - Nome atual do usuário logado
 */
export function ChatHeader({
    title,
    isConnected,
    userName
}: ChatHeaderProps) {
    return (
        <div className="flex items-center justify-between gap-4">
            {/* Título e Status */}
            <div className="flex items-center gap-2">
                <ItemTitle className="text-black dark:text-white text-lg md:text-2xl">
                    {title}
                </ItemTitle>
                <Badge className={`${isConnected ? 'bg-green-500' : 'bg-red-500'} text-white dark:text-black`}>
                    {isConnected ? 'Conectado' : 'Desconectado'}
                </Badge>
            </div>

            {/* Informação do Usuário */}
            <div className="hidden sm:flex items-center gap-2 text-muted-foreground">
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">{userName}</span>
            </div>
        </div>
    )
}
