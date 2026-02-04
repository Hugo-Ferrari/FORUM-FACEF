from pydantic import BaseModel

class PostVotesType(BaseModel):
    id: str
    post_id: str
    user_id: str
    vote_type: str
    created_at: str