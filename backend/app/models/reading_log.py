import uuid
from datetime import date, datetime, timezone
from sqlalchemy import String, DateTime, Integer, Date, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base


class ReadingLog(Base):
    __tablename__ = "reading_logs"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_book_id: Mapped[str] = mapped_column(String(36), ForeignKey("user_books.id", ondelete="CASCADE"), nullable=False)
    pages_read: Mapped[int] = mapped_column(Integer, nullable=False)
    date: Mapped[date] = mapped_column(Date, nullable=False, default=date.today)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    user_book: Mapped["UserBook"] = relationship(back_populates="reading_logs")
