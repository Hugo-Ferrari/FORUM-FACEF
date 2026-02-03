/**
 * Tipos e definições para comunicação WebSocket do Chat
 *
 * Este arquivo centraliza todas as estruturas de dados e eventos
 * relacionados à comunicação Socket.IO entre frontend e backend.
 *
 * Organização:
 * 1. Tipos de Dados (Message, User, etc)
 * 2. Eventos Cliente → Servidor (Outgoing)
 * 3. Eventos Servidor → Cliente (Incoming)
 * 4. Funções auxiliares para criar payloads
 */

// ============================================
// TIPOS DE DADOS
// ============================================

/**
 * Estrutura de uma mensagem no chat
 */
export type Message = {
    id: string              // UUID da mensagem
    text: string            // Conteúdo da mensagem
    sender: string          // ID do usuário que enviou
    sender_name: string     // Nome de exibição do usuário
    created_at: string      // ISO timestamp (ex: "2026-01-20T10:30:00Z")
    chat_id: string         // ID do chat ou room
}

/**
 * Dados de salas disponíveis para o usuário
 */
export type AvailableRooms = {
    chats: string[]         // IDs dos chats normais
    private_rooms: string[] // IDs das rooms privadas (room_es, room_cd)
}

/**
 * Erro retornado pelo servidor
 */
export type SocketError = {
    msg: string             // Mensagem de erro
}

// ============================================
// EVENTOS: CLIENTE → SERVIDOR (Outgoing)
// ============================================

/**
 * Namespace para todos os eventos que o cliente envia ao servidor
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace OutgoingEvents {

    /**
     * Evento: init
     * Descrição: Inicializa a sessão do usuário no servidor
     * Quando usar: Logo após conectar ao Socket.IO
     */
    export type Init = {
        user_id: string     // ID do usuário autenticado
    }

    /**
     * Evento: join_chat
     * Descrição: Entra em um chat normal
     * Quando usar: Quando usuário seleciona um chat
     */
    export type JoinChat = {
        chat_id: string     // ID do chat para entrar
    }

    /**
     * Evento: leave_chat
     * Descrição: Sai de um chat normal
     * Quando usar: Antes de entrar em outro chat ou ao desmontar componente
     */
    export type LeaveChat = {
        chat_id: string     // ID do chat para sair
    }

    /**
     * Evento: join_room
     * Descrição: Entra em uma room privada (requer permissão)
     * Quando usar: Quando usuário seleciona uma room privada
     */
    export type JoinRoom = {
        room_id: string     // ID da room (ex: "room_es", "room_cd")
    }

    /**
     * Evento: leave_room
     * Descrição: Sai de uma room privada
     * Quando usar: Antes de entrar em outra room ou ao desmontar componente
     */
    export type LeaveRoom = {
        room_id: string     // ID da room para sair
    }

    /**
     * Evento: chat_message
     * Descrição: Envia mensagem para chat normal
     * Quando usar: Quando usuário envia mensagem em chat normal
     */
    export type ChatMessage = {
        chat_id: string     // ID do chat
        message: Message    // Objeto completo da mensagem
    }

    /**
     * Evento: room_message
     * Descrição: Envia mensagem para room privada
     * Quando usar: Quando usuário envia mensagem em room privada
     */
    export type RoomMessage = {
        room_id: string     // ID da room
        message: Message    // Objeto completo da mensagem
    }

    /**
     * Evento: list_rooms
     * Descrição: Solicita lista de todas as salas disponíveis
     * Quando usar: Para atualizar lista de salas
     */
    export type ListRooms = void // Não precisa de dados

    /**
     * Evento: get_room_history
     * Descrição: Solicita histórico de mensagens de uma sala
     * Quando usar: Para carregar mais mensagens antigas
     */
    export type GetRoomHistory = {
        room_id: string     // ID do chat ou room
    }
}

// ============================================
// EVENTOS: SERVIDOR → CLIENTE (Incoming)
// ============================================

/**
 * Namespace para todos os eventos que o servidor envia ao cliente
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace IncomingEvents {

    /**
     * Evento: welcome
     * Descrição: Confirmação de conexão estabelecida
     * Quando receber: Logo após conectar
     */
    export type Welcome = {
        msg: string         // Mensagem de boas-vindas (ex: "connected")
    }

    /**
     * Evento: available_rooms
     * Descrição: Lista de salas que o usuário tem acesso
     * Quando receber: Após evento 'init'
     */
    export type AvailableRoomsResponse = AvailableRooms

    /**
     * Evento: chat_history
     * Descrição: Histórico de mensagens de um chat normal
     * Quando receber: Após entrar em um chat (join_chat)
     */
    export type ChatHistory = {
        chat_id: string     // ID do chat
        messages: Message[] // Array de mensagens (últimas 50)
    }

    /**
     * Evento: room_history
     * Descrição: Histórico de mensagens de uma room privada
     * Quando receber: Após entrar em uma room (join_room)
     */
    export type RoomHistory = {
        room_id: string     // ID da room
        messages: Message[] // Array de mensagens (últimas 50)
    }

    /**
     * Evento: chat_response
     * Descrição: Nova mensagem em chat normal (broadcast)
     * Quando receber: Quando alguém envia mensagem no chat
     */
    export type ChatResponse = {
        chat_id: string     // ID do chat
        message: Message    // Mensagem enviada
    }

    /**
     * Evento: room_response
     * Descrição: Nova mensagem em room privada (broadcast)
     * Quando receber: Quando alguém envia mensagem na room
     */
    export type RoomResponse = {
        room_id: string     // ID da room
        message: Message    // Mensagem enviada
    }

    /**
     * Evento: rooms_list
     * Descrição: Lista completa de salas disponíveis
     * Quando receber: Após solicitar via 'list_rooms'
     */
    export type RoomsListResponse = AvailableRooms

    /**
     * Evento: error
     * Descrição: Erro retornado pelo servidor
     * Quando receber: Quando ocorre erro (permissão, validação, etc)
     */
    export type ErrorResponse = SocketError
}

// ============================================
// NOMES DOS EVENTOS (Constants)
// ============================================

/**
 * Constantes com nomes dos eventos
 * Use estas constantes em vez de strings hardcoded
 */
export const SOCKET_EVENTS = {
    // Eventos do cliente
    OUTGOING: {
        INIT: 'init',
        JOIN_CHAT: 'join_chat',
        LEAVE_CHAT: 'leave_chat',
        JOIN_ROOM: 'join_room',
        LEAVE_ROOM: 'leave_room',
        CHAT_MESSAGE: 'chat_message',
        ROOM_MESSAGE: 'room_message',
        LIST_ROOMS: 'list_rooms',
        GET_ROOM_HISTORY: 'get_room_history',
    },

    // Eventos do servidor
    INCOMING: {
        CONNECT: 'connect',
        DISCONNECT: 'disconnect',
        CONNECT_ERROR: 'connect_error',
        WELCOME: 'welcome',
        AVAILABLE_ROOMS: 'available_rooms',
        CHAT_HISTORY: 'chat_history',
        ROOM_HISTORY: 'room_history',
        CHAT_RESPONSE: 'chat_response',
        ROOM_RESPONSE: 'room_response',
        ROOMS_LIST: 'rooms_list',
        ERROR: 'error',
    }
} as const

// ============================================
// FUNÇÕES AUXILIARES (Payload Builders)
// ============================================

/**
 * Cria payload para inicializar sessão
 */
export function createInitPayload(userId: string): OutgoingEvents.Init {
    return { user_id: userId }
}

/**
 * Cria payload para entrar em chat
 */
export function createJoinChatPayload(chatId: string): OutgoingEvents.JoinChat {
    return { chat_id: chatId }
}

/**
 * Cria payload para sair de chat
 */
export function createLeaveChatPayload(chatId: string): OutgoingEvents.LeaveChat {
    return { chat_id: chatId }
}

/**
 * Cria payload para entrar em room
 */
export function createJoinRoomPayload(roomId: string): OutgoingEvents.JoinRoom {
    return { room_id: roomId }
}

/**
 * Cria payload para sair de room
 */
export function createLeaveRoomPayload(roomId: string): OutgoingEvents.LeaveRoom {
    return { room_id: roomId }
}

/**
 * Cria payload para enviar mensagem em chat
 */
export function createChatMessagePayload(
    chatId: string,
    message: Message
): OutgoingEvents.ChatMessage {
    return {
        chat_id: chatId,
        message: message
    }
}

/**
 * Cria payload para enviar mensagem em room
 */
export function createRoomMessagePayload(
    roomId: string,
    message: Message
): OutgoingEvents.RoomMessage {
    return {
        room_id: roomId,
        message: message
    }
}

/**
 * Cria payload para buscar histórico
 */
export function createGetHistoryPayload(roomId: string): OutgoingEvents.GetRoomHistory {
    return { room_id: roomId }
}

// ============================================
// TYPE GUARDS (Validação de Tipos)
// ============================================

/**
 * Verifica se um objeto é uma Message válida
 */
export function isMessage(obj: unknown): obj is Message {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        (obj as Message).id === 'string' &&
        (obj as Message).text === 'string' &&
        (obj as Message).sender === 'string' &&
        (obj as Message).sender_name === 'string' &&
        (obj as Message).created_at === 'string' &&
        (obj as Message).chat_id === 'string'
    )
}

/**
 * Verifica se um objeto é um AvailableRooms válido
 */
export function isAvailableRooms(obj: unknown): obj is AvailableRooms {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        Array.isArray((obj as AvailableRooms).chats) &&
        Array.isArray((obj as AvailableRooms).private_rooms)
    )
}

/**
 * Verifica se um objeto é um SocketError válido
 */
export function isSocketError(obj: unknown): obj is SocketError {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        (obj as SocketError).msg === 'string'
    )
}

// ============================================
// DOCUMENTAÇÃO DE USO
// ============================================

/**
 * EXEMPLO DE USO:
 *
 * import { SOCKET_EVENTS, createChatMessagePayload, Message } from './socketEvents'
 *
 * // Enviar mensagem
 * const message: Message = { ... }
 * const payload = createChatMessagePayload('chat-geral', message)
 * socket.emit(SOCKET_EVENTS.OUTGOING.CHAT_MESSAGE, payload)
 *
 * // Escutar mensagem
 * socket.on(SOCKET_EVENTS.INCOMING.CHAT_RESPONSE, (data: IncomingEvents.ChatResponse) => {
 *     console.log('Nova mensagem:', data.message)
 * })
 */
