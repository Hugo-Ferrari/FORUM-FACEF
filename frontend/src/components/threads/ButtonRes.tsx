"use client"

import { LucideIcon, ThumbsUp, ThumbsDown, MessageSquare, X } from 'lucide-react'
import React, { useState } from 'react'
import {  AnimatePresence } from 'framer-motion'
import DuvidasList from './DuvidasList'

interface PropsButton {
  numberVot: number
  numberRes: number
}

function ButtonRes({
  numberVot,
  numberRes,
}: PropsButton) {
  const [open, setOpen] = useState<boolean>(false)
  const [votes, setVotes] = useState<number>(numberVot)
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null)

  const handleUpvote = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (userVote === 'up') {
      setVotes(v => v - 1)
      setUserVote(null)
    } else {
      setVotes(v => v + (userVote === 'down' ? 2 : 1))
      setUserVote('up')
    }
  }

  return (
    <div className="flex items-center gap-3">
      
      <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1 border border-border">
        <button
          onClick={handleUpvote}
          className={`p-1.5 rounded-md transition-colors ${
            userVote === 'up' ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:bg-muted'
          }`}
        >
          <ThumbsUp size={16} className={userVote === 'up' ? 'fill-current' : ''} />
        </button>
        
        <span className="text-xs font-bold px-1 min-w-[20px] text-center">
          {votes}
        </span>

        <button
          onClick={(e) => {
            e.stopPropagation()
            setUserVote(userVote === 'down' ? null : 'down')
          }}
          className={`p-1.5 rounded-md transition-colors ${
            userVote === 'down' ? 'text-red-500 bg-red-500/10' : 'text-muted-foreground hover:bg-muted'
          }`}
        >
          <ThumbsDown size={16} className={userVote === 'down' ? 'fill-current' : ''} />
        </button>
      </div>

      
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 border border-border hover:border-primary/40 hover:bg-muted transition-all text-muted-foreground hover:text-primary"
      >
        <MessageSquare size={16} />
        <span className="text-xs font-bold">{numberRes}</span>
      </button>

      
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            
            <div onClick={() => setOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            
            <div className="bg-card border border-border w-full max-w-2xl max-h-[85vh] rounded-3xl shadow-2xl overflow-hidden relative z-10"
            >
              
              <div className="flex items-center justify-between p-6 border-b border-border bg-muted/30">
                <div className="flex items-center gap-2">
                  <MessageSquare className="text-primary w-5 h-5" />
                  <h2 className="font-bold text-lg">Respostas e Discussão</h2>
                </div>
                <button
                  className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
                  onClick={() => setOpen(false)}
                >
                  <X size={20} />
                </button>
              </div>

              
              <div className="p-6 overflow-y-auto max-h-[calc(85vh-80px)]">
                <DuvidasList type="modal" />
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ButtonRes