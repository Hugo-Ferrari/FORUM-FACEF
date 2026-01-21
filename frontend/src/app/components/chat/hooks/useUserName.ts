import { useState, useEffect } from 'react'

/**
 * Hook customizado para gerenciar o nome do usuário
 *
 * Responsabilidades:
 * - Carregar nome do usuário do localStorage na inicialização
 * - Salvar nome do usuário no localStorage quando alterado
 * - Fornecer função para atualizar o nome
 *
 * @param defaultName - Nome padrão caso não haja nenhum salvo
 * @returns Nome atual e função para atualizá-lo
 */
export function useUserName(defaultName: string = "Usuário") {
    const [userName, setUserName] = useState<string>(defaultName)

    // Carregar nome salvo do localStorage ao montar
    useEffect(() => {
        const storedName = localStorage.getItem('user_name')
        if (storedName) {
            setUserName(storedName)
            console.log('👤 Nome do usuário carregado:', storedName)
        }
    }, [])

    // Função para atualizar o nome e salvar no localStorage
    const updateUserName = (newName: string) => {
        setUserName(newName)
        localStorage.setItem('user_name', newName)
        console.log('💾 Nome do usuário salvo:', newName)
    }

    return { userName, updateUserName }
}
