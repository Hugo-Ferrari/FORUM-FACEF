from pydantic import BaseModel

class AuthRegisterModel(BaseModel):
    code: int
    password: str
