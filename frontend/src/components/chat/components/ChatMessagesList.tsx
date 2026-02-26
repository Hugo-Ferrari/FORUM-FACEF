import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Message } from '../types/socketEvents'

type ChatMessageProps = {
    message: Message
    isOwnMessage: boolean
    displayTime: string
}

/**
 * Componente para exibir uma única mensagem no chat
 *
 * Responsabilidades:
 * - Renderizar mensagem com estilo apropriado (própria vs. outros)
 * - Mostrar nome do remetente (se não for mensagem própria)
 * - Exibir horário da mensagem
 * - Aplicar estilos diferentes para mensagens próprias e de outros
 *
 * @param message - Dados da mensagem
 * @param isOwnMessage - Se a mensagem é do usuário atual
 * @param displayTime - Horário formatado para exibição
 */
export function ChatMessage({ message, isOwnMessage, displayTime }: ChatMessageProps) {
    return (
        <div className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}>
            <div className={`flex flex-col max-w-[70%] sm:max-w-[50%] min-w-[6rem] px-3 py-2 rounded-lg break-words transition-all duration-300 ease-in-out ${
                isOwnMessage 
                    ? "bg-blue-600 text-white dark:text-black rounded-br-none shadow-lg" 
                    : "bg-white dark:bg-card border text-foreground dark:text-foreground rounded-bl-none"
            }`}>
                {/* Nome do remetente (apenas para mensagens de outros) */}
                {!isOwnMessage && (
                    <div className="text-sm font-medium text-left text-foreground dark:text-foreground">
                        {message.sender_name}
                    </div>
                )}

                {/* Texto da mensagem */}
                <div className="mt-1 text-sm leading-relaxed">
                    {message.text}
                </div>

                {/* Horário */}
                <div className={`text-xs mt-2 ${
                    isOwnMessage ? "text-white/80 text-right" : "text-gray-400 text-left"
                }`}>
                    {displayTime}
                </div>
            </div>
        </div>
    )
}

type ChatMessagesListProps = {
    messages: Message[]
    currentUserId: string
}

/**
 * Componente para exibir a lista de mensagens do chat
 *
 * Responsabilidades:
 * - Renderizar todas as mensagens do chat
 * - Mostrar estado vazio quando não há mensagens
 * - Determinar se cada mensagem é do usuário atual
 *
 * @param messages - Array de mensagens para exibir
 * @param currentUserId - ID do usuário atual (para determinar mensagens próprias)
 */
export function ChatMessagesList({ messages, currentUserId }: ChatMessagesListProps) {
    if (messages.length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <Badge className="bg-transparent border-border text-muted-foreground">
                        Nenhuma mensagem ainda
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-2">
                        Dê início à conversa!
                    </p>
                </div>
            </div>
        )
    }

    return (
        <>
            {messages.map(message => {
                // Converte ambos para string para garantir comparação correta
                const messageSender = String(message.sender)
                const userId = String(currentUserId)
                const isOwnMessage = messageSender === userId

                // Debug logs para verificar a comparação
                console.log(`🔍 DEBUG MESSAGE:`, {
                    messageId: message.id,
                    messageSender: messageSender,
                    messageSenderType: typeof message.sender,
                    currentUserId: userId,
                    currentUserIdType: typeof currentUserId,
                    isOwnMessage: isOwnMessage,
                    comparison: `${messageSender} === ${userId} = ${messageSender === userId}`
                })

                const displayTime = new Date(message.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit"
                })

                return (
                    <ChatMessage
                        key={message.id}
                        message={message}
                        isOwnMessage={isOwnMessage}
                        displayTime={displayTime}
                    />
                )
            })}
        </>
    )
}
