from sqlalchemy import String, ForeignKey, Table, Column
from app.core.database import Base

BookGenre = Table(
    "book_genres",
    Base.metadata,
    Column("book_id", String(36), ForeignKey("books.id", ondelete="CASCADE"), primary_key=True),
    Column("genre_id", String(36), ForeignKey("genres.id", ondelete="CASCADE"), primary_key=True),
)
