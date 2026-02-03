/**
 * Utilitários para formatação de data e hora
 *
 * Responsabilidade:
 * - Formatar timestamps para exibição no chat
 */

/**
 * Formata uma data ISO para horário local (HH:MM)
 *
 * @param isoDate - String de data em formato ISO
 * @returns String formatada com hora e minuto (ex: "14:35")
 */
export function formatMessageTime(isoDate: string): string {
    try {
        const date = new Date(isoDate)
        return date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        })
    } catch {
        return ""
    }
}
