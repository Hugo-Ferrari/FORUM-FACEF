from pydantic import BaseModel

class CourseType(BaseModel):
    id: str # UUID
    name: str
    years_count: int