"use client"
import React, { useState, useCallback } from "react"
import { Item, ItemContent, ItemHeader } from "@/components/ui/item"

// Tipos
import { Message } from "./types/socketEvents"

// Configuração de Rooms
import { ROOMS } from "./config/roomsConfig"

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
import {useAuthStore} from "@/store/auth_store";


/**
 * Componente principal do Chat Geral
 *
 * Responsabilidades:
 * - Orquestrar todos os hooks e componentes
 * - Gerenciar o fluxo de envio de mensagens
 * - Conectar lógica de negócio com UI
 *
 * Estrutura:
 * - useChatSocket: Gerencia conexão WebSocket
 * - useMessages: Gerencia estado das mensagens
 * - useUserName: Gerencia nome do usuário
 * - useAutoScroll: Scroll automático para novas mensagens
 */
function ChatGeral() {
    // ============================================
    // CONFIGURAÇÃO INICIAL
    // ============================================
    const userCode = useAuthStore(s => s.code)
    const USER_ID = String(userCode || 0) // Converte para string, com fallback para "0"
    const ROOM_ID = ROOMS.GENERAL.id // Usando room geral do config ('room_geral')

    // Verificação se o usuário está logado
    if (!userCode || userCode === 0) {
        return (
            <div className="max-w-7xl w-full px-4 md:px-12 flex gap-4">
                <Item className="rounded-lg flex-1">
                    <ItemHeader>
                        <div className="text-center text-muted-foreground">
                            Faça login para acessar o chat
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

    /**
     * Callback quando histórico de mensagens é recebido
     */
    const handleMessagesReceived = useCallback((newMessages: Message[]) => {
        setMessageHistory(newMessages)
    }, [setMessageHistory])

    /**
     * Callback quando nova mensagem chega
     */
    const handleNewMessage = useCallback((message: Message) => {
        addMessage(message)
    }, [addMessage])

    /**
     * Callback quando status de conexão muda
     */
    const handleConnectionChange = useCallback((connected: boolean) => {
        setIsConnected(connected)
    }, [])

    // Conexão Socket.IO
    const { sendMessage: sendSocketMessage } = useChatSocket({
        userId: USER_ID,
        roomId: ROOM_ID,  // Mudou de chatId para roomId
        onMessagesReceived: handleMessagesReceived,
        onNewMessage: handleNewMessage,
        onConnectionChange: handleConnectionChange
    })

    // ============================================
    // HANDLERS
    // ============================================

    /**
     * Handler para enviar mensagem
     */
    const handleSendMessage = useCallback(() => {
        const text = input.trim()
        if (!text || !isConnected) return

        // Criar objeto de mensagem
        const message: Message = {
            id: generateMessageId(),
            text,
            sender: USER_ID, // Agora é string
            sender_name: userName,
            created_at: new Date().toISOString(),
            chat_id: ROOM_ID  // Aqui usa chat_id porque o backend espera esse campo
        }

        // Enviar via socket
        const success = sendSocketMessage(message)

        // Limpar input apenas se enviou com sucesso
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
                {/* Cabeçalho */}
                <ItemHeader>
                    <ChatHeader
                        title={ROOMS.GENERAL.name}  // Usando nome da configuração
                        isConnected={isConnected}
                        userName={userName}
                    />
                </ItemHeader>

                {/* Conteúdo */}
                <ItemContent className="p-0">
                    {/* Lista de Mensagens */}
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

                    {/* Input de Mensagem */}
                    <div className="px-4 pb-4">
                        <ChatInput
                            value={input}
                            onChange={setInput}
                            onSend={handleSendMessage}
                            disabled={!isConnected}
                        />
                    </div>
                </ItemContent>
            </Item>
        </div>
    )
}

export default ChatGeral


