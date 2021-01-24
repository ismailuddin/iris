from typing import List, Optional
from pydantic import BaseModel


class Tag(BaseModel):
    id: int
    name: str


class File(BaseModel):
    id: int
    path: str
    filename: str
    category: str
    tags: List[Tag]

    class Config:
        orm_mode= True
