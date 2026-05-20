from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.user_book import UserBook
from app.models.note import Note
from app.schemas.note import NoteOut, CreateNoteRequest

router = APIRouter()


@router.get("/user-books/{user_book_id}/notes", response_model=list[NoteOut])
def list_notes(
    user_book_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    stmt = (
        select(UserBook)
        .where(UserBook.id == user_book_id, UserBook.user_id == current_user.id)
    )
    user_book = db.execute(stmt).scalar_one_or_none()
    if not user_book:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Book not found")

    stmt = (
        select(Note)
        .where(Note.user_book_id == user_book_id)
        .order_by(Note.created_at)
    )
    notes = db.execute(stmt).scalars().all()
    return [NoteOut.model_validate(n) for n in notes]


@router.post("/user-books/{user_book_id}/notes", response_model=NoteOut, status_code=status.HTTP_201_CREATED)
def create_note(
    user_book_id: str,
    data: CreateNoteRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    stmt = (
        select(UserBook)
        .where(UserBook.id == user_book_id, UserBook.user_id == current_user.id)
    )
    user_book = db.execute(stmt).scalar_one_or_none()
    if not user_book:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Book not found")

    note = Note(
        user_book_id=user_book_id,
        content=data.content,
        page_number=data.page_number,
    )
    db.add(note)
    db.commit()
    db.refresh(note)
    return NoteOut.model_validate(note)


@router.delete("/notes/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_note(
    note_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    stmt = (
        select(Note)
        .join(UserBook)
        .where(Note.id == note_id, UserBook.user_id == current_user.id)
    )
    note = db.execute(stmt).scalar_one_or_none()
    if not note:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found")

    db.delete(note)
    db.commit()
