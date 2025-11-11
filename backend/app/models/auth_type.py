from pydantic import BaseModel


class AuthUserModel(BaseModel):
    id: int
    username: str
    email: str
    course: str
    course_year: int
    role: str
    code: str
    description: str
    skills: list
    is_active: bool
    dark_mode: bool
    last_login: str



class AuthRegisterModel(BaseModel):
    code: int
    password: str