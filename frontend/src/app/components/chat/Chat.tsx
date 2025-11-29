"use client"
import { Send } from "lucide-react"
import React, { useEffect, useRef, useState } from "react"
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Badge} from "@/components/ui/badge";
import {Item, ItemContent, ItemHeader, ItemTitle} from "@/components/ui/item";

type Msg = {
    id: number
    text: string
    sender: string
    time: string
}

function Chat() {
    const [messages, setMessages] = useState<Msg[]>([])
    const [input, setInput] = useState("")
    const [name, setName] = useState("Você")
    const listRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        const handleStorage = (e: StorageEvent) => {
            if (e.key === "chat") {
                try {
                    setMessages(JSON.parse(e.newValue || "[]"))
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
            if (stored) setMessages(JSON.parse(stored))
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

    const sendMessage = (e?: React.FormEvent) => {
        if (e) e.preventDefault()
        const text = input.trim()
        if (!text) return
        const msg: Msg = {
            id: Date.now(),
            text,
            sender: name || "Você",
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
        setMessages(prev => [...prev, msg])
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
