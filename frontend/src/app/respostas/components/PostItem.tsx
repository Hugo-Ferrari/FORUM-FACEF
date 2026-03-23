'use client'

import { Post } from '@/requests/posts_requests'
import Usuario from '@/components/user/Usuario'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import Like from './Like'
import { useAuthStore } from '@/store/auth_store'
import { Clock } from 'lucide-react'

interface PostItemProps {
  post: Post
}

function PostItem({ post }: PostItemProps) {
  const timeAgo = formatDistanceToNow(new Date(post.created_at), {
    addSuffix: true,
    locale: ptBR,
  })

  const course = useAuthStore(state => state.course)
  const course_year = useAuthStore(state => state.course_year)
  
  return (
    <div className=" relative p-6 bg-white dark:bg-card ">
   
   
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-4">
          <div className="relative">
             <Usuario name={post.created_by} course={course} course_year={course_year} />
          </div>
          
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400 bg-slate-50 dark:bg-slate-800/50 px-2 py-1 rounded-md">
            <Clock size={12} />
            {timeAgo}
          </div>
        </div>
      </div>

      <div className="relative ml-1 border-l-2 border-slate-100 dark:border-slate-800 pl-6 mb-6">
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-[15px] whitespace-pre-wrap">
          {post.content}
        </p>
      </div>

      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-4">
          <Like
            postId={post.id}
            relevancy={post.relevancy}
            currentVote={post.vote}
          />
          
          
        </div>

        
        <span className="text-[10px] text-slate-300 dark:text-slate-600 font-mono">
          #{post.id.slice(0, 5)}
        </span>
      </div>
      
      
      <div className="absolute left-0 top-0 w-[3px] h-0 bg-primary transition-all duration-300 group-hover:h-full rounded-r-full" />
    </div>
  )
}

export default PostItem