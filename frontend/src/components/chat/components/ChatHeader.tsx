import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { ItemTitle } from '@/components/ui/item'

type ChatHeaderProps = {
    title: string
    isConnected: boolean
    userName: string
    onUserNameChange: (name: string) => void
}

/**
 * Componente de cabeçalho do chat
 *
 * Responsabilidades:
 * - Exibir título do chat
 * - Mostrar status de conexão (badge verde/vermelho)
 * - Permitir edição do nome do usuário
 * - Responsivo (esconde input de nome em telas pequenas)
 *
 * @param title - Título do chat
 * @param isConnected - Status da conexão
 * @param userName - Nome atual do usuário
 * @param onUserNameChange - Callback quando o nome muda
 */
export function ChatHeader({
    title,
    isConnected,
    userName,
    onUserNameChange
}: ChatHeaderProps) {
    return (
        <div className="flex items-center justify-between gap-4">
            {/* Título e Status */}
            <div className="flex items-center gap-2">
                <ItemTitle className="text-black text-lg md:text-2xl">
                    {title}
                </ItemTitle>
                <Badge className={`${isConnected ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                    {isConnected ? 'Conectado' : 'Desconectado'}
                </Badge>
            </div>

            {/* Input de Nome do Usuário */}
            <div className="hidden sm:flex items-center gap-2">
                <label className="text-xs text-muted-foreground">Nome</label>
                <Input
                    value={userName}
                    onChange={e => onUserNameChange(e.target.value)}
                    aria-label="Nome de exibição"
                    className="w-40"
                />
            </div>
        </div>
    )
}
