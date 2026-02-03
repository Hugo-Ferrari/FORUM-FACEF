/**
 * Configuração centralizada de Rooms do Chat
 *
 * Este arquivo define todas as rooms disponíveis no sistema:
 * - Room Geral: Acessível a todos os usuários
 * - Rooms Privadas: Requerem permissão específica
 *
 * Uso:
 * import { ROOMS, getRoomById, getRoomName } from './roomsConfig'
 */

// ============================================
// TIPOS
// ============================================

export type RoomType = 'general' | 'private'

export type Room = {
    id: string          // ID único da room (usado no backend)
    name: string        // Nome de exibição
    type: RoomType      // Tipo da room
    description: string // Descrição da room
    icon?: string       // Ícone opcional (emoji ou classe)
}

// ============================================
// DEFINIÇÃO DAS ROOMS
// ============================================

/**
 * Room Geral - Acessível a todos
 */
export const ROOM_GENERAL: Room = {
    id: 'room_general',
    name: 'Chat Geral',
    type: 'general',
    description: 'Sala de conversas gerais para todos os usuários',
    icon: '💬'
}

/**
 * Rooms Privadas - Requerem permissão
 */
export const ROOM_ENGENHARIA_SOFTWARE: Room = {
    id: 'room_es',
    name: 'Engenharia de Software',
    type: 'private',
    description: 'Sala privada para alunos de Engenharia de Software',
    icon: '💻'
}

export const ROOM_CIENCIA_DADOS: Room = {
    id: 'room_cd',
    name: 'Ciência de Dados',
    type: 'private',
    description: 'Sala privada para alunos de Ciência de Dados',
    icon: '📊'
}

// ============================================
// COLLECTIONS DE ROOMS
// ============================================

/**
 * Todas as rooms do sistema
 */
export const ALL_ROOMS: Room[] = [
    ROOM_GENERAL,
    ROOM_ENGENHARIA_SOFTWARE,
    ROOM_CIENCIA_DADOS
]

/**
 * Apenas rooms privadas
 */
export const PRIVATE_ROOMS: Room[] = [
    ROOM_ENGENHARIA_SOFTWARE,
    ROOM_CIENCIA_DADOS
]

/**
 * Mapa de rooms por ID (para lookup rápido)
 */
export const ROOMS_MAP: Record<string, Room> = {
    [ROOM_GENERAL.id]: ROOM_GENERAL,
    [ROOM_ENGENHARIA_SOFTWARE.id]: ROOM_ENGENHARIA_SOFTWARE,
    [ROOM_CIENCIA_DADOS.id]: ROOM_CIENCIA_DADOS
}

/**
 * Objeto com todas as rooms organizadas
 */
export const ROOMS = {
    GENERAL: ROOM_GENERAL,
    ENGENHARIA_SOFTWARE: ROOM_ENGENHARIA_SOFTWARE,
    CIENCIA_DADOS: ROOM_CIENCIA_DADOS,

    // Collections
    ALL: ALL_ROOMS,
    PRIVATE: PRIVATE_ROOMS,

    // Map para lookup
    MAP: ROOMS_MAP
} as const

// ============================================
// FUNÇÕES UTILITÁRIAS
// ============================================

/**
 * Busca uma room por ID
 * @param roomId - ID da room
 * @returns Room encontrada ou undefined
 */
export function getRoomById(roomId: string): Room | undefined {
    return ROOMS_MAP[roomId]
}

/**
 * Obtém o nome de exibição de uma room
 * @param roomId - ID da room
 * @returns Nome da room ou o próprio ID se não encontrar
 */
export function getRoomName(roomId: string): string {
    const room = getRoomById(roomId)
    return room ? room.name : roomId
}

/**
 * Obtém o ícone de uma room
 * @param roomId - ID da room
 * @returns Ícone da room ou undefined
 */
export function getRoomIcon(roomId: string): string | undefined {
    const room = getRoomById(roomId)
    return room?.icon
}

/**
 * Verifica se uma room é privada
 * @param roomId - ID da room
 * @returns true se for privada, false caso contrário
 */
export function isPrivateRoom(roomId: string): boolean {
    const room = getRoomById(roomId)
    return room?.type === 'private'
}

/**
 * Verifica se uma room existe
 * @param roomId - ID da room
 * @returns true se a room existe
 */
export function roomExists(roomId: string): boolean {
    return roomId in ROOMS_MAP
}

/**
 * Obtém lista de IDs de todas as rooms
 * @returns Array com IDs das rooms
 */
export function getAllRoomIds(): string[] {
    return Object.keys(ROOMS_MAP)
}

/**
 * Obtém lista de IDs apenas das rooms privadas
 * @returns Array com IDs das rooms privadas
 */
export function getPrivateRoomIds(): string[] {
    return PRIVATE_ROOMS.map(room => room.id)
}

// ============================================
// EXEMPLOS DE USO
// ============================================

/**
 * EXEMPLO 1: Importar uma room específica
 *
 * import { ROOMS } from './roomsConfig'
 *
 * const roomId = ROOMS.GENERAL.id  // 'room_geral'
 * const roomName = ROOMS.GENERAL.name  // 'Chat Geral'
 */

/**
 * EXEMPLO 2: Buscar room por ID
 *
 * import { getRoomById } from './roomsConfig'
 *
 * const room = getRoomById('room_es')
 * if (room) {
 *     console.log(room.name)  // 'Engenharia de Software'
 * }
 */

/**
 * EXEMPLO 3: Verificar se é room privada
 *
 * import { isPrivateRoom } from './roomsConfig'
 *
 * if (isPrivateRoom('room_es')) {
 *     console.log('Esta room requer permissão')
 * }
 */

/**
 * EXEMPLO 4: Listar todas as rooms
 *
 * import { ROOMS } from './roomsConfig'
 *
 * ROOMS.ALL.forEach(room => {
 *     console.log(`${room.icon} ${room.name}`)
 * })
 */
