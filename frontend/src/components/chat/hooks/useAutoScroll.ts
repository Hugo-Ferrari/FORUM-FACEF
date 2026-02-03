import { useEffect, useRef } from 'react'

/**
 * Hook customizado para auto-scroll do chat
 *
 * Responsabilidades:
 * - Rolar automaticamente para o final quando novas mensagens chegam
 * - Usar scroll suave para melhor UX
 *
 * @param dependencies - Array de dependências que acionam o scroll
 * @returns Ref para anexar ao container de mensagens
 */
export function useAutoScroll(dependencies: any[] = []) {
    const scrollRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: 'smooth'
            })
        }
    }, [dependencies])

    return scrollRef
}
