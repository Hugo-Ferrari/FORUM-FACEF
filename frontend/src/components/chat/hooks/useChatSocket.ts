import { useState, useEffect } from 'react'
import { io, Socket } from 'socket.io-client'
import {
    Message,
    SOCKET_EVENTS,
    IncomingEvents,
    createInitPayload,
    createJoinRoomPayload,
    createRoomMessagePayload
} from '../types/socketEvents'

type UseChatSocketProps = {
    userId: string
    roomId: string  // roomId no frontend = room_id no backend
    onMessagesReceived: (messages: Message[]) => void
    onNewMessage: (message: Message) => void
    onConnectionChange: (isConnected: boolean) => void
}

/**
 * Hook customizado para gerenciar a conexão Socket.IO do chat
 *
 * Responsabilidades:
 * - Estabelecer e gerenciar conexão WebSocket
 * - Inicializar sessão do usuário
 * - Escutar eventos do servidor
 * - Emitir eventos para o servidor
 *
 * IMPORTANTE: O backend USA eventos de "room" (verificado em server.py)
 * - Caminho: /api/ws (não /socket.io)
 * - join_room (não join_chat)
 * - room_message (não chat_message)
 * - room_history (não chat_history)
 * - room_response (não chat_response)
 * - available_rooms (não available_chats)
 *
 * @param userId - ID do usuário conectado
 * @param roomId - ID da room/sala
 * @param onMessagesReceived - Callback quando histórico é recebido
 * @param onNewMessage - Callback quando nova mensagem chega
 * @param onConnectionChange - Callback quando status da conexão muda
 * @returns Socket instance e função para enviar mensagens
 */
export function useChatSocket({
    userId,
    roomId,
    onMessagesReceived,
    onNewMessage,
    onConnectionChange
}: UseChatSocketProps) {
    const [socket, setSocket] = useState<Socket | null>(null)

    useEffect(() => {
        if (typeof window === "undefined" || !userId) return

        // Criar conexão Socket.IO
        // IMPORTANTE: Backend usa caminho /api/ws não /socket.io
        const newSocket = io("http://127.0.0.1:8000", {
            path: "/api/ws",
            withCredentials: true,
            transports: ['websocket', 'polling'],
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        })

        setSocket(newSocket)

        // ==========================================
        // EVENTOS DE CONEXÃO
        // ==========================================

        // Handler: Conexão estabelecida
        newSocket.on(SOCKET_EVENTS.INCOMING.CONNECT, () => {
            console.log("✅ Socket conectado:", newSocket.id)
            onConnectionChange(true)

            // Inicializar sessão com user_id
            const initPayload = createInitPayload(userId)
            newSocket.emit(SOCKET_EVENTS.OUTGOING.INIT, initPayload)
        })

        // Handler: Desconexão
        newSocket.on(SOCKET_EVENTS.INCOMING.DISCONNECT, (reason: string) => {
            console.warn('⚠️ Socket desconectado:', reason)
            onConnectionChange(false)
        })

        // Handler: Erro de conexão
        newSocket.on(SOCKET_EVENTS.INCOMING.CONNECT_ERROR, (err: Error) => {
            console.error('❌ Erro de conexão:', err)
            onConnectionChange(false)
        })

        // ==========================================
        // EVENTOS DO SERVIDOR
        // ==========================================

        // Handler: Mensagem de boas-vindas
        newSocket.on(SOCKET_EVENTS.INCOMING.WELCOME, (data: IncomingEvents.Welcome) => {
            console.log("👋 Bem-vindo:", data)
        })

        // Handler: Salas disponíveis (após init)
        // NOTA: Backend envia "available_rooms" com campo "rooms" (não "chats")
        newSocket.on('available_rooms', (data: { rooms: string[] }) => {
            console.log("📋 Rooms disponíveis:", data)

            // Auto-entrar na room usando JOIN_ROOM
            const joinPayload = createJoinRoomPayload(roomId)
            newSocket.emit(SOCKET_EVENTS.OUTGOING.JOIN_ROOM, joinPayload)
        })

        // Handler: Histórico da room
        // NOTA: Backend envia "room_history" não "chat_history"
        newSocket.on(SOCKET_EVENTS.INCOMING.ROOM_HISTORY, (data: IncomingEvents.RoomHistory) => {
            console.log(`📜 Histórico da ${data.room_id}:`, data.messages.length, "mensagens")
            if (data.room_id === roomId) {
                onMessagesReceived(data.messages)
            }
        })

        // Handler: Nova mensagem na room
        // NOTA: Backend envia "room_response" não "chat_response"
        newSocket.on(SOCKET_EVENTS.INCOMING.ROOM_RESPONSE, (data: IncomingEvents.RoomResponse) => {
            console.log("💬 Nova mensagem:", data)
            if (data.room_id === roomId) {
                onNewMessage(data.message)
            }
        })

        // Handler: Erros
        newSocket.on(SOCKET_EVENTS.INCOMING.ERROR, (error: IncomingEvents.ErrorResponse) => {
            console.error("❌ Erro do servidor:", error.msg)
            alert(`Erro: ${error.msg}`)
        })

        // ==========================================
        // CLEANUP
        // ==========================================

        // Cleanup ao desmontar
        return () => {
            console.log("🔌 Desconectando socket...")
            newSocket.disconnect()
        }
    }, [userId, roomId, onMessagesReceived, onNewMessage, onConnectionChange])

    /**
     * Envia uma mensagem para a room
     * NOTA: Backend espera "room_message" não "chat_message"
     */
    const sendMessage = (message: Message) => {
        if (!socket || !socket.connected) {
            console.warn('⚠️ Socket não conectado')
            return false
        }

        const payload = createRoomMessagePayload(roomId, message)
        socket.emit(SOCKET_EVENTS.OUTGOING.ROOM_MESSAGE, payload)

        return true
    }

    return { socket, sendMessage }
}
