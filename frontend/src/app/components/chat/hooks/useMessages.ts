import { useState, useCallback } from 'react'
import { Message } from '../types/socketEvents'

/**
 * Hook customizado para gerenciar o estado das mensagens do chat
 *
 * Responsabilidades:
 * - Armazenar lista de mensagens
 * - Adicionar novas mensagens (evitando duplicatas)
 * - Substituir todo o histórico de mensagens
 * - Limpar mensagens
 *
 * @returns Estado e funções para manipular mensagens
 */
export function useMessages() {
    const [messages, setMessages] = useState<Message[]>([])

    /**
     * Define o histórico completo de mensagens
     */
    const setMessageHistory = useCallback((newMessages: Message[]) => {
        setMessages(newMessages)
    }, [])

    /**
     * Adiciona uma nova mensagem, evitando duplicatas
     */
    const addMessage = useCallback((newMessage: Message) => {
        setMessages((prev) => {
            // Evitar duplicatas verificando o ID
            if (prev.find(m => m.id === newMessage.id)) {
                console.log('⚠️ Mensagem duplicada ignorada:', newMessage.id)
                return prev
            }
            return [...prev, newMessage]
        })
    }, [])

    /**
     * Limpa todas as mensagens
     */
    const clearMessages = useCallback(() => {
        setMessages([])
    }, [])

    return {
        messages,
        setMessageHistory,
        addMessage,
        clearMessages
    }
}
