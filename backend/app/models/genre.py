import uuid
from typing import Optional
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base


class Genre(Base):
    __tablename__ = "genres"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)

    books: Mapped[list["Book"]] = relationship(
        secondary="book_genres",
        back_populates="genres",
    )
