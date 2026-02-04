from pydantic import BaseModel

class PostValidationsType(BaseModel):
    id: str
    post_id: str
    validated_by: str
    validated_at: str