from pydantic import BaseModel
from typing import Optional


class PostType(BaseModel):
    id: Optional[str] = None
    thread_id: str
    content: str
    is_anonymous: bool
    ai_flag: bool
    created_by: str
    created_at: Optional[str] = None
    updated_at: Optional[str] = None