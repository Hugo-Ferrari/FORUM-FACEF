import React from 'react'
import { Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type ChatInputProps = {
    value: string
    onChange: (value: string) => void
    onSend: () => void
    disabled?: boolean
    placeholder?: string
}

/**
 * Componente de input para enviar mensagens
 *
 * Responsabilidades:
 * - Capturar entrada de texto do usuário
 * - Enviar mensagem ao pressionar Enter ou clicar no botão
 * - Desabilitar quando não conectado
 * - Limpar input após envio (gerenciado pelo componente pai)
 *
 * @param value - Valor atual do input
 * @param onChange - Callback quando o texto muda
 * @param onSend - Callback quando a mensagem deve ser enviada
 * @param disabled - Se o input está desabilitado
 * @param placeholder - Texto de placeholder
 */
export function ChatInput({
    value,
    onChange,
    onSend,
    disabled = false,
    placeholder = "Escreva uma mensagem e pressione Enter..."
}: ChatInputProps) {

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !disabled && value.trim()) {
            onSend()
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!disabled && value.trim()) {
            onSend()
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex gap-2 items-center">
            <Input
                value={value}
                onChange={e => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                aria-label="Mensagem"
                className="flex-1"
                disabled={disabled}
            />
            <Button
                type="submit"
                aria-label="Enviar mensagem"
                size="icon"
                className="bg-blue-600 text-white dark:text-black hover:bg-blue-700"
                disabled={disabled || !value.trim()}
            >
                <Send className="h-4 w-4" />
            </Button>
        </form>
    )
}
