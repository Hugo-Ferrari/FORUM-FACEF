"use client"
import React, { useState, useCallback } from "react"
import { Lock } from "lucide-react"
import { Item, ItemContent, ItemHeader } from "@/components/ui/item"

// Tipos
import { Message } from "./types/socketEvents"

// Configuração de Rooms
import { ROOMS } from "./config/roomsConfig"

// Store de autenticação
import { useAuthStore } from "@/store/auth_store"

// Hooks customizados
import { useChatSocket } from "./hooks/useChatSocket"
import { useMessages } from "./hooks/useMessages"
import { useUserName } from "./hooks/useUserName"
import { useAutoScroll } from "./hooks/useAutoScroll"

// Componentes
import { ChatHeader } from "./components/ChatHeader"
import { ChatMessagesList } from "./components/ChatMessagesList"
import { ChatInput } from "./components/ChatInput"

// Utilitários
import { generateMessageId } from "./utils/messageId"

/**
 * Componente principal do Chat do Curso
 *
 * Conecta à room privada baseada no curso do usuário
 * Usa automaticamente os dados do usuário logado
 */
function ChatCurso() {
    // ============================================
    // CONFIGURAÇÃO INICIAL
    // ============================================
    const userCode = useAuthStore(s => s.code)
    const USER_ID = String(userCode || 0) // Converte para string, com fallback para "0"
    const ROOM_ID = ROOMS.ENGENHARIA_SOFTWARE.id // Room privada do curso

    // Verificação se o usuário está logado
    if (!userCode || userCode === 0) {
        return (
            <div className="max-w-7xl w-full px-4 md:px-12 flex gap-4">
                <Item className="rounded-lg flex-1">
                    <ItemHeader>
                        <div className="text-center text-muted-foreground">
                             Faça login para acessar o chat do curso
                        </div>
                    </ItemHeader>
                </Item>
            </div>
        )
    }

    // ============================================
    // ESTADO
    // ============================================
    const [input, setInput] = useState("")
    const [isConnected, setIsConnected] = useState(false)

    // ============================================
    // HOOKS CUSTOMIZADOS
    // ============================================

    // Gerenciar mensagens
    const { messages, setMessageHistory, addMessage } = useMessages()

    // Gerenciar nome do usuário (agora obtém automaticamente da autenticação)
    const { userName } = useUserName("Usuário")

    // Auto-scroll quando mensagens mudam
    const scrollRef = useAutoScroll([messages])

    // ============================================
    // CALLBACKS PARA SOCKET
    // ============================================

    const handleMessagesReceived = useCallback((newMessages: Message[]) => {
        setMessageHistory(newMessages)
    }, [setMessageHistory])

    const handleNewMessage = useCallback((message: Message) => {
        addMessage(message)
    }, [addMessage])

    const handleConnectionChange = useCallback((connected: boolean) => {
        setIsConnected(connected)
    }, [])

    // Conexão Socket.IO
    const { sendMessage: sendSocketMessage } = useChatSocket({
        userId: USER_ID,
        roomId: ROOM_ID,
        onMessagesReceived: handleMessagesReceived,
        onNewMessage: handleNewMessage,
        onConnectionChange: handleConnectionChange
    })

    // ============================================
    // HANDLERS
    // ============================================

    const handleSendMessage = useCallback(() => {
        const text = input.trim()
        if (!text || !isConnected) return

        const message: Message = {
            id: generateMessageId(),
            text,
            sender: USER_ID,
            sender_name: userName,
            created_at: new Date().toISOString(),
            chat_id: ROOM_ID
        }

        const success = sendSocketMessage(message)

        if (success) {
            setInput("")
        }
    }, [input, isConnected, userName, sendSocketMessage, ROOM_ID])

    // ============================================
    // RENDER
    // ============================================
    return (
        <div className="max-w-7xl w-full px-4 md:px-12 flex gap-4">
            <Item className="rounded-lg flex-1">
                <ItemHeader>
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <Lock className="h-5 w-5 text-yellow-600" />
                            <ChatHeader
                                title={ROOMS.ENGENHARIA_SOFTWARE.name}
                                isConnected={isConnected}
                            />
                        </div>
                    </div>
                </ItemHeader>

                <ItemContent className="p-0">
                    <div
                        ref={scrollRef}
                        role="log"
                        aria-live="polite"
                        className="mb-3 h-[36rem] overflow-auto space-y-3 px-4 py-6 border-t rounded-b bg-gray-50 dark:bg-card"
                    >
                        <ChatMessagesList
                            messages={messages}
                            currentUserId={USER_ID}
                        />
                    </div>

                    <div className="px-4 pb-4">
                        <ChatInput
                            value={input}
                            onChange={setInput}
                            onSend={handleSendMessage}
                            disabled={!isConnected}
                            placeholder={`Mensagem em ${ROOMS.ENGENHARIA_SOFTWARE.name}...`}
                        />
                    </div>
                </ItemContent>
            </Item>
        </div>
    )
}

export default ChatCurso
