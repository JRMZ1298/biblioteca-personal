from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session, selectinload
from sqlalchemy import select, delete
from typing import Optional
from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.book import Book
from app.models.user_book import UserBook
from app.models.book_genre import BookGenre
from app.schemas.book import CreateBookRequest, UpdateBookRequest, UserBookOut, BookOut

router = APIRouter()


@router.get("", response_model=list[UserBookOut])
def list_books(
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    stmt = (
        select(UserBook)
        .options(selectinload(UserBook.book).selectinload(Book.genres))
        .where(UserBook.user_id == current_user.id)
    )
    if status:
        stmt = stmt.where(UserBook.status == status)
    stmt = stmt.order_by(UserBook.created_at.desc()) if hasattr(UserBook, 'created_at') else stmt
    user_books = db.execute(stmt).scalars().all()
    return [UserBookOut.model_validate(ub) for ub in user_books]


@router.get("/{book_id}", response_model=UserBookOut)
def get_book(
    book_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    stmt = (
        select(UserBook)
        .options(selectinload(UserBook.book).selectinload(Book.genres))
        .where(UserBook.id == book_id, UserBook.user_id == current_user.id)
    )
    user_book = db.execute(stmt).scalar_one_or_none()
    if not user_book:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Book not found")
    return UserBookOut.model_validate(user_book)


@router.post("", response_model=UserBookOut, status_code=status.HTTP_201_CREATED)
def create_book(
    data: CreateBookRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if data.google_books_id:
        stmt = select(Book).where(Book.google_books_id == data.google_books_id)
        book = db.execute(stmt).scalar_one_or_none()
    else:
        book = None

    if not book:
        book = Book(
            title=data.title,
            author=data.author,
            description=data.description,
            thumbnail=data.thumbnail,
            pages=data.pages,
            published_date=data.published_date,
            google_books_id=data.google_books_id,
        )
        db.add(book)
        db.flush()

    if data.genre_ids:
        stmt = select(BookGenre).where(
            BookGenre.c.book_id == book.id,
            BookGenre.c.genre_id.in_(data.genre_ids),
        )
        existing_genre_ids = {row.genre_id for row in db.execute(stmt).all()}
        for genre_id in data.genre_ids:
            if genre_id not in existing_genre_ids:
                db.execute(BookGenre.insert().values(book_id=book.id, genre_id=genre_id))

    user_book = UserBook(
        user_id=current_user.id,
        book_id=book.id,
        status="PENDING",
    )
    db.add(user_book)
    db.commit()
    db.refresh(user_book)
    db.refresh(book, ["genres"])

    user_book.book = book
    return UserBookOut.model_validate(user_book)


@router.put("/{book_id}", response_model=UserBookOut)
def update_book(
    book_id: str,
    data: UpdateBookRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    stmt = (
        select(UserBook)
        .options(selectinload(UserBook.book).selectinload(Book.genres))
        .where(UserBook.id == book_id, UserBook.user_id == current_user.id)
    )
    user_book = db.execute(stmt).scalar_one_or_none()
    if not user_book:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Book not found")

    update_data = data.model_dump(exclude_unset=True)
    genre_ids = update_data.pop("genre_ids", None)

    for field, value in update_data.items():
        setattr(user_book, field, value)

    if genre_ids is not None:
        db.execute(
            delete(BookGenre).where(BookGenre.c.book_id == user_book.book_id)
        )
        for gid in genre_ids:
            db.execute(BookGenre.insert().values(book_id=user_book.book_id, genre_id=gid))

    db.commit()
    db.refresh(user_book)
    return UserBookOut.model_validate(user_book)


@router.delete("/{book_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_book(
    book_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    stmt = select(UserBook).where(UserBook.id == book_id, UserBook.user_id == current_user.id)
    user_book = db.execute(stmt).scalar_one_or_none()
    if not user_book:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Book not found")

    book_id_value = user_book.book_id
    db.delete(user_book)

    stmt = select(UserBook).where(UserBook.book_id == book_id_value)
    remaining = db.execute(stmt).scalar_one_or_none()
    if not remaining:
        stmt = select(Book).where(Book.id == book_id_value)
        book = db.execute(stmt).scalar_one_or_none()
        if book:
            db.delete(book)

    db.commit()
