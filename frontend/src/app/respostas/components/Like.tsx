'use client'

import { usePostStore } from '@/store/posts_store'
import { Badge } from '@/components/ui/badge'
import { ThumbsUp, ThumbsDown } from 'lucide-react'
import React, { useState } from 'react'


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
      if (localVote ===1 ) {
        
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
    <div className="flex gap-2 items-center">
      {error && (
        <span className="text-red-500 text-sm">{error}</span>
      )}
      
      <Badge variant="secondary" className="flex items-center gap-2">
        <button
          className={`flex items-center gap-1 transition-colors ${
            localVote === 1
            ? 'text-green-500 hover:text-green-600'
              : 'hover:text-green-500 text-gray-600'
          } disabled:opacity-50`}
          onClick={handleUpvote}
          disabled={loading}
          title="Votar positivamente"
        >
          <ThumbsUp size={16} />
        </button>

        <span className="text-sm font-semibold min-w-[24px] text-center">
          {relevancy}
        </span>

        <button
          className={`flex items-center gap-1 transition-colors ${
            localVote === -1
              ? 'text-red-500 hover:text-red-600'
              : 'hover:text-red-500 text-gray-600'
          } disabled:opacity-50`}
          onClick={handleDownvote}
          disabled={loading}
          title="Votar negativamente"
        >
          <ThumbsDown size={16} />
        </button>
      </Badge>
    </div>
  )
}

export default Like