from pydantic import BaseModel

class UserModel(BaseModel):
    id: str # UUID
    facef_code: int
    name: str
    description: str
    skills: list
    links: list
    is_active: bool
    dark_mode: bool
    last_login: str
    created_at: str
    updated_at: str
    course_id: str # UUID
    courses_year: int
    role: str


