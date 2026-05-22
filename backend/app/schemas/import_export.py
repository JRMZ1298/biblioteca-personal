from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class ExportBookOut(BaseModel):
    title: str
    author: str
    description: Optional[str] = None
    thumbnail: Optional[str] = None
    pages: Optional[int] = None
    published_date: Optional[str] = None
    google_books_id: Optional[str] = None
    genres: list[str] = []
    status: str
    current_page: Optional[int] = None
    rating: Optional[float] = None
    started_at: Optional[datetime] = None
    finished_at: Optional[datetime] = None
    notes: list["ExportNoteOut"] = []


class ExportNoteOut(BaseModel):
    content: str
    page_number: Optional[int] = None


class ImportPreviewBook(BaseModel):
    row: int
    title: str
    author: str
    exists: bool
    reason: str


class ImportPreviewResponse(BaseModel):
    total: int
    books: list[ImportPreviewBook]
