'use client'

import { Post } from '@/requests/posts_requests'
import Usuario from '@/components/user/Usuario'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import Like from './Like'
import { useAuthStore } from '@/store/auth_store'

interface PostItemProps {
  post: Post
}

function PostItem({ post }: PostItemProps) {
  const timeAgo = formatDistanceToNow(new Date(post.created_at), {
    addSuffix: true,
    locale: ptBR,
  })

  const name = useAuthStore(state => state.name)
  const course = useAuthStore(state => state.course)
  const course_year = useAuthStore(state => state.course_year)
  
  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <Usuario name={name} course={course} course_year={course_year} />
          <span className="text-sm text-gray-500 ">{timeAgo}</span>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-gray-800">{post.content}</p>
      </div>

      <div className="flex items-center justify-between">
        <Like
          postId={post.id}
          relevancy={post.relevancy}
          currentVote={post.vote}
        />
      </div>
    </div>
  )
}

export default PostItem
