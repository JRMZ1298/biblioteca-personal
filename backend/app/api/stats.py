from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import select, func
from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.book import Book
from app.models.user_book import UserBook
from app.models.genre import Genre
from app.models.book_genre import BookGenre
from app.schemas.stats import OverviewStats, FavoriteGenre, TopAuthor

router = APIRouter()


@router.get("/overview", response_model=OverviewStats)
def get_overview_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    user_books_stmt = select(UserBook).where(UserBook.user_id == current_user.id)
    user_books = db.execute(user_books_stmt).scalars().all()

    total_books = len(user_books)
    completed_books = sum(1 for ub in user_books if ub.status == "COMPLETED")
    reading_books = sum(1 for ub in user_books if ub.status == "READING")
    pending_books = sum(1 for ub in user_books if ub.status == "PENDING")

    book_ids = [ub.book_id for ub in user_books]
    total_pages = 0
    if book_ids:
        stmt = select(func.coalesce(func.sum(Book.pages), 0)).where(Book.id.in_(book_ids))
        total_pages = db.execute(stmt).scalar() or 0

    avg_pages_per_book = round(total_pages / total_books, 1) if total_books > 0 else 0

    avg_reading_days = 0
    completed_with_dates = [ub for ub in user_books if ub.status == "COMPLETED" and ub.started_at and ub.finished_at]
    if completed_with_dates:
        total_days = sum((ub.finished_at - ub.started_at).days for ub in completed_with_dates)
        avg_reading_days = round(total_days / len(completed_with_dates), 1)

    return OverviewStats(
        total_books=total_books,
        total_pages=total_pages,
        completed_books=completed_books,
        reading_books=reading_books,
        pending_books=pending_books,
        avg_pages_per_book=avg_pages_per_book,
        avg_reading_days=avg_reading_days,
    )


@router.get("/favorite-genres", response_model=list[FavoriteGenre])
def get_favorite_genres(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    stmt = (
        select(
            Genre.name.label("genre"),
            func.count(BookGenre.c.book_id).label("count"),
        )
        .join(BookGenre, Genre.id == BookGenre.c.genre_id)
        .join(UserBook, BookGenre.c.book_id == UserBook.book_id)
        .where(UserBook.user_id == current_user.id)
        .group_by(Genre.id, Genre.name)
        .order_by(func.count(BookGenre.c.book_id).desc())
        .limit(10)
    )
    results = db.execute(stmt).all()
    return [FavoriteGenre(genre=row.genre, count=row.count) for row in results]


@router.get("/top-authors", response_model=list[TopAuthor])
def get_top_authors(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    stmt = (
        select(
            Book.author.label("author"),
            func.count(Book.id).label("count"),
        )
        .join(UserBook, Book.id == UserBook.book_id)
        .where(UserBook.user_id == current_user.id)
        .group_by(Book.author)
        .order_by(func.count(Book.id).desc())
        .limit(10)
    )
    results = db.execute(stmt).all()
    return [TopAuthor(author=row.author, count=row.count) for row in results]
