from pydantic import BaseModel
from typing import Optional

class ChatsModel(BaseModel):
    id: str
    name: str
    is_general: bool
    course_id: Optional[str] = None
    created_at: str

class ChatsMessageModel(BaseModel):
    id: str
    chat_id: str
    sender_id: str
    content: str
    created_at: str
