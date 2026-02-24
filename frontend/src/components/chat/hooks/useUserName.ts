import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/auth_store'

/**
 * Hook customizado para gerenciar o nome do usuário
 *
 * Responsabilidades:
 * - Obter automaticamente o nome do usuário logado do authStore
 * - Sincronizar com mudanças na autenticação
 * - Não permite edição manual (usa dados da sessão)
 *
 * @param defaultName - Nome padrão caso não haja usuário logado
 * @returns Nome atual do usuário logado
 */
export function useUserName(defaultName: string = "Usuário") {
    const authName = useAuthStore(s => s.name)
    const authCode = useAuthStore(s => s.code)

    const [userName, setUserName] = useState<string>(defaultName)

    // Sincronizar com o nome do usuário logado
    useEffect(() => {
        if (authName && authName.trim() !== '') {
            setUserName(authName)
            console.log('👤 Nome do usuário obtido da autenticação:', authName)
        } else if (authCode && authCode !== 0) {
            // Se não tem nome mas tem código, usa "Usuário + código"
            const fallbackName = `Usuário ${authCode}`
            setUserName(fallbackName)
            console.log('👤 Nome de fallback gerado:', fallbackName)
        } else {
            setUserName(defaultName)
            console.log('👤 Usando nome padrão:', defaultName)
        }
    }, [authName, authCode, defaultName])

    // Retorna apenas o nome (não mais editável)
    return { userName }
}
