from pydantic import BaseModel, Field
from typing import Optional
from ..models.post_type import PostTypeResponse


class ThreadsType(BaseModel):
    id: Optional[str] = None
    title: str = Field(..., min_length=1, max_length=200, description="Título da thread")
    content: str = Field(..., min_length=1, description="Conteúdo da thread")
    created_by: Optional[str] = None
    is_anonymous: bool = Field(default=False, description="Se a thread é anônima")
    course_id: Optional[str] = None
    year: Optional[int] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None
    ai_suggested_answer: Optional[str] = None
    posts: Optional[int] = 0


class ThreadCreateRequest(BaseModel):
    title: str = Field(..., min_length=1, max_length=200, description="Título da thread")
    content: str = Field(..., min_length=1, description="Conteúdo da thread")
    is_anonymous: bool = Field(default=False, description="Se a thread é anônima")


class ThreadsResponse(BaseModel):
    thread: ThreadsType
    posts: list[PostTypeResponse]