from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional


class NoteOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    user_book_id: str
    content: str
    page_number: Optional[int] = None
    created_at: datetime


class CreateNoteRequest(BaseModel):
    content: str
    page_number: Optional[int] = None
