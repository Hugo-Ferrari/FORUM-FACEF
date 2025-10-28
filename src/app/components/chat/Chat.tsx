
"use client"
import { Send } from "lucide-react"
import React, { useEffect, useRef, useState } from "react"

type Msg = {
    id: number
    text: string
    sender: string
    time: string
}

function Chat() {
    const [messages, setMessages] = useState<Msg[]>(() => {
        try {
            return JSON.parse(localStorage.getItem("chat") || "[]")
        } catch {
            return []
        }
    })
    const [input, setInput] = useState("")
    const [name, setName] = useState(() => localStorage.getItem("chat_name") || "Você")
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
        localStorage.setItem("chat", JSON.stringify(messages))

        if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight
        }
    }, [messages])

    useEffect(() => {
        localStorage.setItem("chat_name", name)
    }, [name])

    const sendMessage = () => {
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
        <div className="max-w-5xl  w-full  rounded-lg  p-4 text-black">
            <div>

            </div>
            <div className="flex items-center justify-between mb-3">
                <div>
                    <h3 className="font-semibold text-black text-3xl">Chat Geral</h3>
                    <p className="text-xs text-gray-500"></p>
                </div>
            </div>

            <div
                ref={listRef}
                className="mb-3 h-170 overflow-auto space-y-3 px-2 py-1 border rounded bg-gray-50"
                aria-live="polite"
            >
                {messages.length === 0 && (
                    <div className="text-center text-sm text-gray-500 mt-8">Nenhuma mensagem ainda. Dê início à conversa!</div>
                )}

                {messages.map(m => {
                    const isOwn = m.sender === (name || "Você")
                    return (
                        <div
                            key={m.id}
                            className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`max-w-[80%] px-3 py-2 rounded-lg break-words ${isOwn ? "bg-blue-600 text-white rounded-br-none" : "bg-white border text-gray-800 rounded-bl-none"
                                    }`}
                            >
                                <div className="text-sm font-medium">{isOwn ? "Você" : m.sender}</div>
                                <div className="mt-1 text-sm">{m.text}</div>
                                <div className="text-xs text-gray-300 mt-1 text-right">{m.time}</div>
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className="flex gap-2">
                <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Escreva uma mensagem e pressione Enter..."
                    className="flex-1 px-3 py-2 border rounded focus:outline-none"
                    aria-label="Mensagem"
                />
                <button
                    onClick={sendMessage}
                    className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                    <Send/>
                </button>
            </div>
        </div>
    )
}

export default Chat
