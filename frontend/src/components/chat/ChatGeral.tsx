"use client"
import React, { useState, useCallback } from "react"
import {  AnimatePresence } from "framer-motion"
import { Send, Smile, Paperclip, Hash, Lock, Globe } from "lucide-react"

// Hooks e Configurações Reais
import { ROOMS, Room } from "./config/roomsConfig"
import { useChatSocket } from "./hooks/useChatSocket"
import { useMessages } from "./hooks/useMessages"
import { useUserName } from "./hooks/useUserName"
import { useAutoScroll } from "./hooks/useAutoScroll"
import { useAuthStore } from "@/store/auth_store"
import { generateMessageId } from "./utils/messageId"
import { Message } from "./types/socketEvents"
import { Button } from "../ui/button"

function ChatComunidade() {
    const userCode = useAuthStore(s => s.code)
    const USER_ID = String(userCode || 0)
    const { userName } = useUserName("Usuário")

    // Estado da Room Ativa (Inicia com a Geral do seu config)
    const [activeRoom, setActiveRoom] = useState<Room>(ROOMS.GENERAL)
    const [input, setInput] = useState("")
    const [isConnected, setIsConnected] = useState(false)

    const { messages, setMessageHistory, addMessage } = useMessages()
    const scrollRef = useAutoScroll([messages, activeRoom.id])

    // Callbacks do Socket
    const handleMessagesReceived = useCallback((newMessages: Message[]) => setMessageHistory(newMessages), [setMessageHistory])
    const handleNewMessage = useCallback((message: Message) => addMessage(message), [addMessage])
    const handleConnectionChange = useCallback((connected: boolean) => setIsConnected(connected), [])

    // Conexão dinâmica: Quando activeRoom.id muda, o hook reconecta à nova sala
    const { sendMessage: sendSocketMessage } = useChatSocket({
        userId: USER_ID,
        roomId: activeRoom.id,
        onMessagesReceived: handleMessagesReceived,
        onNewMessage: handleNewMessage,
        onConnectionChange: handleConnectionChange
    })

    const handleSendMessage = () => {
        const text = input.trim()
        if (!text || !isConnected) return
        
        const message: Message = {
            id: generateMessageId(),
            text,
            sender: USER_ID,
            sender_name: userName,
            created_at: new Date().toISOString(),
            chat_id: activeRoom.id
        }

        if (sendSocketMessage(message)) setInput("")
    }

    if (!userCode || userCode === 0) return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-muted-foreground italic">
            Acesso restrito. Por favor, realize o login.
        </div>
    )

    return (
        <div className="container mx-auto px-4 py-6 max-w-7xl">
            <div className="flex gap-4 h-[calc(100vh-200px)] min-h-[600px]"
            >
                
                <aside className="hidden md:flex flex-col w-64 shrink-0  bg-card border border-border p-4 shadow-sm">
                    <h3 className="font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-4 px-2">
                        Canais Uni-FACEF
                    </h3>
                    
                    <nav className="space-y-1 flex-1">
                        {ROOMS.ALL.map(room => (
                            <Button
                                key={room.id}
                                onClick={() => setActiveRoom(room)}
                                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-between group ${
                                    activeRoom.id === room.id 
                                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    <span className="text-base">{room.icon}</span>
                                    {room.name}
                                </div>
                                {room.type === 'private' && (
                                    <Lock className={`w-3 h-3 ${activeRoom.id === room.id ? "text-primary-foreground/70" : "text-muted-foreground/50"}`} />
                                )}
                            </Button>
                        ))}
                    </nav>

                    
                    <div className="mt-auto pt-4 border-t border-border flex items-center gap-3 px-1">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold border border-primary/20 shrink-0">
                            {userName.charAt(0)}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-xs font-bold truncate text-foreground leading-none mb-1">{userName}</p>
                            <div className="flex items-center gap-1">
                                <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? "bg-green-500 animate-pulse" : "bg-destructive"}`} />
                                <span className="text-[9px] text-muted-foreground uppercase font-semibold">
                                    {isConnected ? "Conectado" : "Offline"}
                                </span>
                            </div>
                        </div>
                    </div>
                </aside>

                
                <main className="flex-1 flex flex-col  bg-card border border-border overflow-hidden shadow-sm relative">
                    
                    <header className="px-6 py-4 border-b border-border bg-card/50 backdrop-blur-md flex items-center justify-between z-10">
                        <div className="flex items-center gap-3">
                            <div className="text-2xl">{activeRoom.icon}</div>
                            <div>
                                <h3 className="font-bold text-foreground leading-tight flex items-center gap-2">
                                    {activeRoom.name}
                                </h3>
                                <p className="text-[11px] text-muted-foreground font-medium italic truncate max-w-[200px] md:max-w-none">
                                    {activeRoom.description}
                                </p>
                            </div>
                        </div>
                        <div className="hidden sm:flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-muted/50 px-3 py-1.5 rounded-full border border-border/50">
                            <Hash className="w-3 h-3 text-primary" /> {activeRoom.type}
                        </div>
                    </header>

                    
                    <div 
                        ref={scrollRef}
                        className="flex-1 overflow-y-auto p-6 space-y-6 bg-[url('/subtle-dots.png')] bg-repeat"
                    >
                        <AnimatePresence mode="popLayout">
                            {messages.map((msg) => (
                                <div className={`flex items-start gap-3 ${msg.sender === USER_ID ? "flex-row-reverse" : "flex-row"}`}
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 shadow-sm border ${
                                        msg.sender === USER_ID ? "bg-primary text-primary-foreground border-primary/20" : "bg-muted text-foreground border-border"
                                    }`}>
                                        {msg.sender_name?.charAt(0)}
                                    </div>
                                    <div className={`flex flex-col ${msg.sender === USER_ID ? "items-end" : "items-start"}`}>
                                        <div className="flex items-baseline gap-2 mb-1 px-1">
                                            <span className="text-[10px] font-bold text-foreground/80">{msg.sender_name}</span>
                                            <span className="text-[9px] text-muted-foreground">
                                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <div className={`px-4 py-2.5 rounded-2xl text-sm shadow-sm max-w-sm md:max-w-lg ${
                                            msg.sender === USER_ID 
                                            ? "bg-primary text-primary-foreground rounded-tr-none" 
                                            : "bg-white dark:bg-zinc-900 text-foreground rounded-tl-none border border-border/40"
                                        }`}>
                                            {msg.text}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </AnimatePresence>
                    </div>

                    
                    <footer className="p-4 bg-card border-t border-border">
                        <div className="flex items-center gap-2 rounded-xl border border-input bg-background/50 px-4 py-1.5 focus-within:ring-2 focus-within:ring-primary/20 transition-all shadow-inner">
                            <Button className="text-muted-foreground hover:text-primary transition-colors p-1.5">
                                <Paperclip className="w-5 h-5" />
                            </Button>
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder={`Enviar em #${activeRoom.name}...`}
                                className="flex-1 bg-transparent border-none focus:outline-none text-sm py-2"
                                disabled={!isConnected}
                            />
                            <Button className="text-muted-foreground hover:text-yellow-500 transition-colors p-1.5 hidden sm:block">
                                <Smile className="w-5 h-5" />
                            </Button>
                            <Button 
                                onClick={handleSendMessage}
                                disabled={!input.trim() || !isConnected}
                                className="bg-primary hover:bg-primary/90 disabled:opacity-40 text-primary-foreground p-2 rounded-lg transition-all active:scale-95 shadow-md flex-shrink-0"
                            >
                                <Send className="w-4 h-4" />
                            </Button>
                        </div>
                    </footer>
                </main>
            </div>
        </div>
    )
}

export default ChatComunidade;