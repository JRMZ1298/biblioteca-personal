from pydantic import BaseModel


class OverviewStats(BaseModel):
    total_books: int
    total_pages: int
    completed_books: int
    reading_books: int
    pending_books: int
    avg_pages_per_book: float
    avg_reading_days: float


class FavoriteGenre(BaseModel):
    genre: str
    count: int


class TopAuthor(BaseModel):
    author: str
    count: int
