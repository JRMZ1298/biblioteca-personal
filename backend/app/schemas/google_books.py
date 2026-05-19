from pydantic import BaseModel
from typing import Optional


class GoogleBookVolumeInfo(BaseModel):
    title: str
    authors: Optional[list[str]] = None
    description: Optional[str] = None
    imageLinks: Optional[dict[str, str]] = None
    pageCount: Optional[int] = None
    publishedDate: Optional[str] = None
    categories: Optional[list[str]] = None


class GoogleBookItem(BaseModel):
    id: str
    volumeInfo: GoogleBookVolumeInfo


class GoogleBooksResponse(BaseModel):
    items: Optional[list[GoogleBookItem]] = None
    totalItems: int
