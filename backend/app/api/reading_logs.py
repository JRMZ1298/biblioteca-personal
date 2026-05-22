from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, selectinload
from sqlalchemy import select
from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.user_book import UserBook
from app.models.reading_log import ReadingLog
from app.models.book import Book
from app.schemas.reading_log import ReadingLogCreate, ReadingLogOut

router = APIRouter()


@router.post("/{user_book_id}/reading-logs", response_model=ReadingLogOut, status_code=status.HTTP_201_CREATED)
def create_reading_log(
    user_book_id: str,
    data: ReadingLogCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    stmt = (
        select(UserBook)
        .options(selectinload(UserBook.book))
        .where(UserBook.id == user_book_id, UserBook.user_id == current_user.id)
    )
    user_book = db.execute(stmt).scalar_one_or_none()
    if not user_book:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Book not found")

    if data.pages_read <= 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="pages_read must be positive")

    if user_book.book.pages and user_book.current_page and user_book.current_page + data.pages_read > user_book.book.pages:
        remaining = user_book.book.pages - (user_book.current_page or 0)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"pages_read ({data.pages_read}) exceeds remaining pages ({remaining})",
        )

    log = ReadingLog(
        user_book_id=user_book.id,
        pages_read=data.pages_read,
        date=data.date,
    )
    db.add(log)
    user_book.current_page = (user_book.current_page or 0) + data.pages_read
    db.commit()
    db.refresh(log)
    return ReadingLogOut(
        id=log.id,
        user_book_id=log.user_book_id,
        pages_read=log.pages_read,
        date=log.date,
        created_at=log.created_at.isoformat(),
    )


@router.get("/{user_book_id}/reading-logs", response_model=list[ReadingLogOut])
def list_reading_logs(
    user_book_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    stmt = select(UserBook).where(UserBook.id == user_book_id, UserBook.user_id == current_user.id)
    user_book = db.execute(stmt).scalar_one_or_none()
    if not user_book:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Book not found")

    logs = (
        db.execute(
            select(ReadingLog)
            .where(ReadingLog.user_book_id == user_book_id)
            .order_by(ReadingLog.date)
        )
        .scalars()
        .all()
    )
    return [
        ReadingLogOut(
            id=log.id,
            user_book_id=log.user_book_id,
            pages_read=log.pages_read,
            date=log.date,
            created_at=log.created_at.isoformat(),
        )
        for log in logs
    ]
