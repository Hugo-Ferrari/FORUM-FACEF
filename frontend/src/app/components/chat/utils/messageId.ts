/**
 * Utilitário para gerar IDs únicos para mensagens
 *
 * Responsabilidade:
 * - Gerar IDs únicos usando crypto.randomUUID() quando disponível
 * - Fallback para geração baseada em timestamp + random
 */

/**
 * Gera um ID único para uma mensagem
 *
 * @returns String com ID único
 */
export function generateMessageId(): string {
    try {
        // Tentar usar crypto.randomUUID (padrão moderno)
        if (typeof crypto !== 'undefined' && typeof (crypto as any).randomUUID === 'function') {
            return (crypto as any).randomUUID()
        }
    } catch {
        // Ignorar erros e usar fallback
    }

    // Fallback: timestamp + string aleatória
    return Date.now().toString() + Math.random().toString(36).slice(2, 8)
}
