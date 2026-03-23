'use client'

import { usePostStore } from '@/store/posts_store'
import { ThumbsUp, ThumbsDown, AlertCircle } from 'lucide-react'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'

interface LikeProps {
  postId: string
  relevancy: number
  currentVote: number | null
}

function Like({ postId, relevancy, currentVote }: LikeProps) {
  const { votePost, removeVote, loading } = usePostStore()
  const [localVote, setLocalVote] = useState<number | null>(currentVote)
  const [error, setError] = useState<string | null>(null)

  const handleUpvote = async () => {
    try {
      setError(null)
      if (localVote === 1) {
        await removeVote(postId)
        setLocalVote(null)
      } else {
        await votePost(postId, 'upvote')
        setLocalVote(1)
      }
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleDownvote = async () => {
    try {
      setError(null)
      if (localVote === -1) {
        await removeVote(postId)
        setLocalVote(null)
      } else {
        await votePost(postId, 'downvote')
        setLocalVote(-1)
      }
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center bg-slate-100/80 dark:bg-slate-800/50 p-1 rounded-xl w-fit border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm">
          
        <Button
          onClick={handleUpvote}
          disabled={loading}
          className={`group flex items-center justify-center p-2 rounded-lg transition-all ${
            localVote === 1
              ? 'bg-white dark:bg-slate-700 shadow-sm text-emerald-500'
              : 'text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10'
          }`}
          title="Útil"
        >
          <ThumbsUp 
            size={18} 
            className={`transition-transform group-active:scale-125 ${localVote === 1 ? 'fill-current' : ''}`} 
          />
        </Button>

        
        <div className="px-3 min-w-[40px] text-center">
          <span className={`text-sm font-bold tabular-nums ${
            localVote === 1 ? 'text-emerald-600 dark:text-emerald-400' : 
            localVote === -1 ? 'text-rose-600 dark:text-rose-400' : 
            'text-slate-600 dark:text-slate-300'
          }`}>
            {relevancy}
          </span>
        </div>

        
        <Button
          onClick={handleDownvote}
          disabled={loading}
          className={`group flex items-center justify-center p-2 rounded-lg transition-all ${
            localVote === -1
              ? 'bg-white dark:bg-slate-700 shadow-sm text-rose-500'
              : 'text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10'
          }`}
          title="Não foi útil"
        >
          <ThumbsDown 
            size={18} 
            className={`transition-transform group-active:scale-125 ${localVote === -1 ? 'fill-current' : ''}`} 
          />
        </Button>
      </div>

      
      <AnimatePresence>
        {error && (
          <div className="flex items-center gap-1.5 text-rose-500 text-[10px] font-bold uppercase tracking-wider ml-1"
          >
            <AlertCircle size={12} />
            {error}
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Like