
'use client'



/* °melhorar a cor do site
    ° se a pessoa entrar no site deve-se aparecer "bem vindo fulano" e quando a pessoa já tiver um login deve-se aparecer "bem vindo de volta"
    ° integrar com o banco de dados da facef
    ° mudar o site quando for disponibilizado o bd da facef
    ° melhorar a estetica para ficar mais adequado para a facef  */



import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Mail, Lock, ArrowRight, Hourglass } from 'lucide-react'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const API= process.env.NEXT_PUBLIC_API_URL

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Preencha email e senha.')
      return
    }

    setLoading(true)

    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      let data: any = {}
      try {
        data = await res.json()
      } catch {
        data = {}
      }

      if (!res.ok) {
        setError(data.detail || data.message || 'Erro ao fazer login')
        setLoading(false)
        return
      }

      if (data.access_token) {
        localStorage.setItem('token', data.access_token)
      } else if (data.token) {
        localStorage.setItem('token', data.token)
      }

      router.push('/')
    } catch (error) {
      console.error('Login error:', error)
      setError('Erro ao conectar ao servidor.')
    } finally {
      setLoading(false)
    }
  }
    
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 items-center">
        
        
        <div className="hidden md:flex flex-col justify-center">
          <div className="mb-8">
            <div className="w-48 h-20 relative mb-6">
              <Image 
                src="/img/Uni-FACEF.png" 
                alt="Uni-FACEF" 
                fill
                className="object-contain"
                style={{filter: 'brightness(0) saturate(100%) invert(34%) sepia(92%) saturate(1292%) hue-rotate(201deg)'}}
              />
            </div>
            <h1 className="text-4xl font-extrabold text-blue-600 mb-4">
              Fórum FACEF
            </h1>
            <p className="text-lg text-foreground dark:text-foreground max-w-md font-medium mb-8">
              Conecte-se com sua comunidade acadêmica, tire dúvidas e compartilhe conhecimento.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-600/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-blue-600 font-bold text-sm">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground dark:text-foreground">Comunidade Ativa</h3>
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground">Interaja com alunos e professores</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-600/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-blue-600 font-bold text-sm">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground dark:text-foreground">Respostas Rápidas</h3>
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground">Tire suas dúvidas com a comunidade</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-600/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-blue-600 font-bold text-sm">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Gamificação</h3>
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground">Ganhe pontos e suba no ranking</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        
        <div className="flex flex-col justify-center">
          <div className="bg-white dark:bg-black rounded shadow-lg p-8 border border-gray-100">
            

            <div className="md:hidden mb-6 text-center">
              <h1 className="text-3xl font-extrabold text-blue-600">
                Fórum FACEF
              </h1>
            </div>

            <div className="mb-8">
              <h2 className="text-3xl font-bold text-foreground dark:text-foreground mb-2">
                Bem-vindo de volta
              </h2>
              <p className="text-muted-foreground dark:text-muted-foreground">
                Entre com sua conta para acessar a comunidade
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5" noValidate>
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-foreground dark:text-foreground mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    placeholder="seu@email.com"
                    className="w-full pl-10 pr-4 py-2.5 border border-border dark:border-border rounded-lg bg-white dark:bg-card text-foreground dark:text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                    disabled={loading}
                    />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="password" className="block text-sm font-semibold text-foreground dark:text-foreground">
                    Senha
                  </label>
                  <Link
                    href="/recuperar-senha"
                    className="text-xs text-blue-600 hover:text-[#0d3d7a] transition-colors font-medium">
                    Esqueceu?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 border border-border dark:border-border rounded-lg bg-white dark:bg-card text-foreground dark:text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                    disabled={loading}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-[#0d3d7a] text-white dark:text-black font-semibold py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-md"
>
                {loading ? (
                  <>
                    <span className="animate-spin"><Hourglass/></span>
                    Entrando...
                  </>
                ) : (
                  <>
                    Entrar
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border dark:border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-black text-gray-600">
                  Não tem conta?
                </span>
              </div>
            </div>

            <Link
              href="/cadastro"
              className="w-full block text-center px-4 py-2.5 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-[#1561B7]/5 transition-all duration-200">
              Criar Conta
            </Link>

            <div className="mt-6 pt-6 border-t border-border dark:border-border">
              <p className="text-xs text-center text-muted-foreground dark:text-muted-foreground">
                Ao acessar, você concorda com nossos{' '}
                <Link href="/termos" className="text-[#1561B7] hover:underline font-medium">
                  Termos de Serviço
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


