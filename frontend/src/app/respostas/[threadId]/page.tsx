"use client"

import React, { useEffect, useState } from "react"
import Usuario from "@/components/user/Usuario"
import { useThreadStore, Thread } from "@/store/threads_store"
import { usePostStore } from "@/store/posts_store"
import { useAuthStore } from "@/store/auth_store"
import PostItem from "../components/PostItem"



interface Props {
  params: { threadId: string }
}

export default function RespostasPage({ params }: Props) {
  const { posts, fetchPostsByThread } = usePostStore()
  const { currentThread, fetchThreadById } = useThreadStore()

  const name = useAuthStore(state => state.name)
  const course = useAuthStore(state => state.course)

  const sortedPosts = [...posts].sort((a, b) => b.relevancy - a.relevancy) 

  useEffect(() => {

    fetchThreadById(params.threadId)
    fetchPostsByThread(params.threadId)
  }, [fetchThreadById, fetchPostsByThread])

  console.log("currentThread", currentThread)
  console.log("posts", posts)
  return (
    <div className="p-4">
      {currentThread && (
        <div className="mt-4 ">
          <h2 className="font-bold text-2xl ml-2">DUVIDA</h2>
          <div className="mt- mb-6 bg-white/50 dark:bg-card p-4 rounded">
            <Usuario name={currentThread.created_by} course={course} course_year={currentThread.year} />
            <h2 className="text-xl font-semibold">{currentThread.title}</h2>
            <p className="">{currentThread.content} </p>
            <div className="mt-3 text-sm text-gray-600 ">
              Aberta por <strong >{name}</strong>  <p>{currentThread.posts}{"  "}respostas</p>
            </div>
          </div>
        </div>
      )}

      <h3 className="font-semibold mb-2">Respostas</h3>
      {posts.length === 0 && (
        <p className="text-gray-600">Ainda não há respostas.</p>
      )}

      <ul className="space-y-3">
        {sortedPosts.map(post=> (
          <li key={post.id}>
            <PostItem post={post} />
          </li>
        ))}
      </ul>
    </div>
   
  )
}
