from datetime import date
from pydantic import BaseModel


class ReadingLogCreate(BaseModel):
    pages_read: int
    date: date


class ReadingLogOut(BaseModel):
    id: str
    user_book_id: str
    pages_read: int
    date: date
    created_at: str
