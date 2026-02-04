from pydantic import BaseModel
from typing import Optional, Literal

class PostsVotesType(BaseModel):
    id: Optional[str] = None
    post_id: str
    user_id: Optional[str] = None
    vote_type: Literal["upvote", "downvote"]
    created_at: Optional[str] = None


class PostsVotesCreateRequest(BaseModel):
    post_id: str
    vote_type: Literal["upvote", "downvote"]


class PostsVotesResponse(BaseModel):
    id: str
    post_id: str
    user_id: str
    vote_type: str
    created_at: Optional[str] = None
