from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional

from app.schemas.genre import GenreOut
from app.schemas.note import NoteOut


class BookOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    author: str
    description: Optional[str] = None
    thumbnail: Optional[str] = None
    pages: Optional[int] = None
    published_date: Optional[str] = None
    google_books_id: Optional[str] = None
    created_at: datetime
    genres: list[GenreOut] = []


class UserBookOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    user_id: str
    book_id: str
    book: BookOut
    status: str
    current_page: Optional[int] = None
    started_at: Optional[datetime] = None
    finished_at: Optional[datetime] = None
    rating: Optional[float] = None
    notes: list[NoteOut] = []
    created_at: datetime


class CreateBookRequest(BaseModel):
    title: str
    author: str
    description: Optional[str] = None
    thumbnail: Optional[str] = None
    pages: Optional[int] = None
    published_date: Optional[str] = None
    google_books_id: Optional[str] = None
    genre_ids: Optional[list[str]] = None


class UpdateBookRequest(BaseModel):
    status: Optional[str] = None
    current_page: Optional[int] = None
    rating: Optional[float] = None
    started_at: Optional[datetime] = None
    finished_at: Optional[datetime] = None
    genre_ids: Optional[list[str]] = None
