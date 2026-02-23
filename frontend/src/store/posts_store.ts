import { Post, UpdatePost,req_create_post,req_search_post_id,req_update_post } from "@/requests/posts_requests";
import { create } from "zustand";

export interface PostResponse {
    post: Post[],
    count:string,
    

    createPost: (thread_id: string, content: string) => Promise<void>
    searchPostById: (post_id: string) => Promise<void>
    updatePost: (post_id:string, data:UpdatePost ) => Promise<void>
}

export const usePostStore = create<PostResponse>(){

}