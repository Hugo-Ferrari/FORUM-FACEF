from pydantic import BaseModel
from typing import Optional

from ..models.post_votes_types import PostsVotesType


class PostType(BaseModel):
    id: Optional[str] = None
    thread_id: str
    content: str
    created_by: Optional[str] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None


class PostCreateRequest(BaseModel):
    thread_id: str
    content: str


class PostUpdateRequest(BaseModel):
    content: Optional[str] = None


class PostTypeResponse(BaseModel):
    id: str
    thread_id: str
    content: str
    created_by: Optional[str] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None
    vote: Optional[PostsVotesType] = None
    relevancy: Optional[int] = 0
