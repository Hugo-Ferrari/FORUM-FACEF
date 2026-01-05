"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Send } from "lucide-react"
import React, { useEffect, useRef, useState } from "react"
import { io, Socket } from "socket.io-client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Item, ItemContent, ItemHeader, ItemTitle } from "@/components/ui/item";

type Msg = {
    id: string
    text: string
    sender: string
    time: string
}

function Chat() {
    const [messages, setMessages] = useState<Msg[]>([])
    const [input, setInput] = useState("")
    const [name, setName] = useState("Você")
    const listRef = useRef<HTMLDivElement | null>(null)
    const socketRef = useRef<Socket | null>(null)

    // helper para gerar id único (usa crypto.randomUUID quando disponível)
    const generateId = () => {
        try {
            if (typeof crypto !== 'undefined' && typeof (crypto as any).randomUUID === 'function') {
                // prefer UUID
                return (crypto as any).randomUUID()
            }
        } catch {
            // ignore
        }
        return Date.now().toString() + Math.random().toString(36).slice(2, 8)
    }

    useEffect(() => {
        const handleStorage = (e: StorageEvent) => {
            if (e.key === "chat") {
                try {
                    const parsed = JSON.parse(e.newValue || "[]")
                    // garante que os ids sejam strings e remove duplicatas
                    const normalized: Msg[] = (parsed || []).map((m: any) => ({ ...m, id: String(m.id) }))
                    // dedup
                    const unique = normalized.filter((v: Msg, i: number, a: Msg[]) => a.findIndex(x => x.id === v.id) === i)
                    setMessages(unique)
                } catch {

                }
            }
            if (e.key === "chat_name") {
                setName(e.newValue || "Você")
            }
        }
        window.addEventListener("storage", handleStorage)
        return () => window.removeEventListener("storage", handleStorage)
    }, [])

    useEffect(() => {
        try {
            const stored = localStorage.getItem("chat")
            if (stored) {
                const parsed = JSON.parse(stored || "[]")
                const normalized: Msg[] = (parsed || []).map((m: any) => ({ ...m, id: String(m.id) }))
                const unique = normalized.filter((v: Msg, i: number, a: Msg[]) => a.findIndex(x => x.id === v.id) === i)
                setMessages(unique)
            }
        } catch {
            // ignore invalid json
        }
        const storedName = localStorage.getItem("chat_name")
        if (storedName) setName(storedName)
    }, [])

    useEffect(() => {
        localStorage.setItem("chat", JSON.stringify(messages))

        if (listRef.current) {
            // smooth scroll to bottom for better UX
            listRef.current.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
        }
    }, [messages])

    useEffect(() => {
        localStorage.setItem("chat_name", name)
    }, [name])

    // cria conexão socket.io apenas no cliente
    useEffect(() => {
        if (typeof window === "undefined") return
        try {
            const socket = io("http://localhost:8000", {
                path: "/socket.io",
                withCredentials: true,
                transports: ['websocket', 'polling'],
                reconnectionAttempts: 5,
                reconnectionDelay: 1000,
            })
            socketRef.current = socket

            socket.on("connect", () => {
                console.log("socket connected", socket.id)
            })

            socket.on("disconnect", (reason: any) => {
                console.warn('socket disconnected', reason)
            })

            socket.on("connect_error", (err: any) => {
                console.error('socket connect_error', err)
            })

            socket.on("reconnect_attempt", (attempt: number) => {
                console.log('reconnect_attempt', attempt)
            })

            socket.on("reconnect_failed", () => {
                console.error('reconnect_failed')
            })

            socket.on("welcome", (data: any) => {
                console.log("welcome", data)
            })

            socket.on("chat_message", (msg: any) => {
                // garante id como string e evita duplicatas
                const incoming: Msg = { ...msg, id: String(msg.id ?? generateId()) }
                setMessages((prev) => {
                    if (prev.find(m => m.id === incoming.id)) return prev
                    return [...prev, incoming]
                })
            })
        } catch (err) {
            console.error("socket.io import/connect failed", err)
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect()
                socketRef.current = null
            }
        }
    }, [])

    const sendMessage = (e?: React.FormEvent) => {
        if (e) e.preventDefault()
        const text = input.trim()
        if (!text) return
        const msg: Msg = {
            id: generateId(),
            text,
            sender: name || "Você",
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
        // envia localmente
        setMessages(prev => [...prev, msg])
        // envia para o servidor via socket
        try {
            const socket = socketRef.current
            if (socket && (socket as any).connected) {
                socket.emit('chat_message', msg)
            } else if (socket) {
                // se não está conectado no momento, tente emitir quando reconectar
                const tryEmitOnReconnect = () => {
                    if ((socket as any).connected) {
                        socket.emit('chat_message', msg)
                        socket.off('connect', tryEmitOnReconnect)
                    }
                }
                socket.on('connect', tryEmitOnReconnect)
            }
        } catch (err) {
            console.error('emit failed', err)
        }
        setInput("")
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            sendMessage()
        }
    }

    return (
        <div className="max-w-5xl w-full px-12">
            <Item className="rounded-lg">
                <ItemHeader>
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <ItemTitle className="text-black text-lg md:text-2xl">Chat Geral</ItemTitle>
                        </div>

                        <div className="hidden sm:flex items-center gap-2">
                            <label className="text-xs text-muted-foreground">Nome</label>
                            <Input value={name} onChange={e => setName(e.target.value)} aria-label="Nome de exibição" className="w-40" />
                        </div>
                    </div>
                </ItemHeader>

                <ItemContent className="p-0">
                    <div
                        ref={listRef}
                        role="log"
                        aria-live="polite"
                        className="mb-3 h-[36rem] overflow-auto space-y-3 px-4 py-6 border-t rounded-b bg-gray-50"
                    >
                        {messages.length === 0 ? (
                            <div className="flex items-center justify-center h-full">
                                <div className="text-center">
                                    <Badge className="bg-transparent border-gray-200 text-gray-500">Nenhuma mensagem ainda</Badge>
                                    <p className="text-sm text-muted-foreground mt-2">Dê início à conversa!</p>
                                </div>
                            </div>
                        ) : (
                            messages.map(m => {
                                const isOwn = m.sender === (name || "Você")
                                return (
                                    <div key={m.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                                        <div className={`flex flex-col max-w-[70%] sm:max-w-[50%] min-w-[6rem] px-3 py-2 rounded-lg break-words transition-all duration-300 ease-in-out ${isOwn ? "bg-blue-600 text-white rounded-br-none shadow-lg" : "bg-white border text-gray-800 rounded-bl-none"}`}>
                                            {!isOwn && <div className="text-sm font-medium text-left text-gray-700">{m.sender}</div>}
                                            <div className="mt-1 text-sm leading-relaxed">{m.text}</div>
                                            <div className={`text-xs mt-2 ${isOwn ? "text-white/80 text-right" : "text-gray-400 text-left"}`}>{m.time}</div>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>

                    <div className="px-4 pb-4">
                        <form onSubmit={sendMessage} className="flex gap-2 items-center">
                            <Input
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Escreva uma mensagem e pressione Enter..."
                                aria-label="Mensagem"
                                className="flex-1"
                            />
                            <Button type="submit" aria-label="Enviar mensagem" size="icon" className="bg-blue-600 text-white hover:bg-blue-700">
                                <Send className="h-4 w-4" />
                            </Button>
                        </form>
                    </div>
                </ItemContent>
            </Item>
        </div>
    )
}

export default Chat
