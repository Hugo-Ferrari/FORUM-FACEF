from pydantic import BaseModel
from typing import Optional
from ..models.post_type import PostTypeResponse


class ThreadsType(BaseModel):
    id: Optional[str] = None
    title: str
    content: str
    created_by: Optional[str] = None
    is_anonymous: bool
    course_id: Optional[str] = None
    year: Optional[str] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None
    ai_suggested_answer: Optional[str] = None


class ThreadsResponse(BaseModel):
    thread: ThreadsType
    posts: list[PostTypeResponse]