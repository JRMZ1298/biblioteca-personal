import csv
import io
import json
from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File, status
from sqlalchemy.orm import Session, selectinload
from sqlalchemy import select, or_
from typing import Optional
from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.book import Book
from app.models.user_book import UserBook
from app.models.note import Note
from app.schemas.import_export import ExportBookOut, ImportPreviewBook, ImportPreviewResponse

router = APIRouter()


def _serialize_user_books(user_books: list[UserBook]) -> list[dict]:
    result = []
    for ub in user_books:
        book = ub.book
        result.append({
            "title": book.title,
            "author": book.author,
            "description": book.description,
            "thumbnail": book.thumbnail,
            "pages": book.pages,
            "published_date": book.published_date,
            "google_books_id": book.google_books_id,
            "genres": [g.name for g in book.genres],
            "status": ub.status,
            "current_page": ub.current_page,
            "rating": ub.rating,
            "started_at": ub.started_at.isoformat() if ub.started_at else None,
            "finished_at": ub.finished_at.isoformat() if ub.finished_at else None,
            "notes": [
                {"content": n.content, "page_number": n.page_number}
                for n in ub.notes
            ],
        })
    return result


@router.get("/export")
def export_books(
    format: str = Query("json", regex="^(json|csv)$"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    stmt = (
        select(UserBook)
        .options(
            selectinload(UserBook.book).selectinload(Book.genres),
            selectinload(UserBook.notes),
        )
        .where(UserBook.user_id == current_user.id)
        .order_by(UserBook.created_at)
    )
    user_books = db.execute(stmt).scalars().all()

    if format == "json":
        data = {
            "version": 1,
            "exported_at": None,
            "books": _serialize_user_books(user_books),
        }
        return data

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        "title", "author", "description", "thumbnail", "pages",
        "published_date", "google_books_id", "genres", "status",
        "current_page", "rating", "started_at", "finished_at", "notes",
    ])
    for ub in user_books:
        book = ub.book
        notes_str = "|".join(
            f"{n.content}@@{n.page_number or ''}" for n in ub.notes
        )
        writer.writerow([
            book.title,
            book.author,
            book.description or "",
            book.thumbnail or "",
            book.pages or "",
            book.published_date or "",
            book.google_books_id or "",
            "|".join(g.name for g in book.genres),
            ub.status,
            ub.current_page or "",
            ub.rating or "",
            ub.started_at.isoformat() if ub.started_at else "",
            ub.finished_at.isoformat() if ub.finished_at else "",
            notes_str,
        ])

    from fastapi.responses import PlainTextResponse
    return PlainTextResponse(output.getvalue(), media_type="text/csv")


def _find_existing_book(db: Session, title: str, author: str, google_books_id: Optional[str]) -> Optional[Book]:
    if google_books_id:
        stmt = select(Book).where(Book.google_books_id == google_books_id)
        book = db.execute(stmt).scalar_one_or_none()
        if book:
            return book
    stmt = select(Book).where(
        Book.title == title,
        Book.author == author,
    )
    return db.execute(stmt).scalar_one_or_none()


def _parse_json_books(content: str) -> list[dict]:
    data = json.loads(content)
    if isinstance(data, list):
        return data
    if isinstance(data, dict) and "books" in data:
        return data["books"]
    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid JSON format")


def _parse_csv_books(content: str) -> list[dict]:
    reader = csv.DictReader(io.StringIO(content))
    books = []
    expected = {"title", "author"}
    for row in reader:
        if not expected.issubset(row.keys()):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="CSV must have title and author columns",
            )
        notes_list = []
        raw_notes = row.get("notes", "")
        if raw_notes:
            for part in raw_notes.split("|"):
                if "@@" in part:
                    note_content, note_page = part.split("@@", 1)
                    notes_list.append({
                        "content": note_content,
                        "page_number": int(note_page) if note_page else None,
                    })
                elif part.strip():
                    notes_list.append({"content": part, "page_number": None})

        genres_str = row.get("genres", "")
        books.append({
            "title": row["title"],
            "author": row["author"],
            "description": row.get("description") or None,
            "thumbnail": row.get("thumbnail") or None,
            "pages": int(row["pages"]) if row.get("pages") else None,
            "published_date": row.get("published_date") or None,
            "google_books_id": row.get("google_books_id") or None,
            "genres": [g.strip() for g in genres_str.split("|") if g.strip()] if genres_str else [],
            "status": row.get("status", "PENDING"),
            "current_page": int(row["current_page"]) if row.get("current_page") else None,
            "rating": float(row["rating"]) if row.get("rating") else None,
            "started_at": row.get("started_at") or None,
            "finished_at": row.get("finished_at") or None,
            "notes": notes_list,
        })
    return books


@router.post("/import/preview", response_model=ImportPreviewResponse)
def preview_import(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    raw = file.file.read().decode("utf-8-sig")

    if file.filename and file.filename.endswith(".csv"):
        books_data = _parse_csv_books(raw)
    else:
        books_data = _parse_json_books(raw)

    preview_books = []
    for i, b in enumerate(books_data):
        existing_book = _find_existing_book(db, b["title"], b["author"], b.get("google_books_id"))
        if existing_book:
            stmt = select(UserBook).where(
                UserBook.user_id == current_user.id,
                UserBook.book_id == existing_book.id,
            )
            existing_ub = db.execute(stmt).scalar_one_or_none()
            if existing_ub:
                preview_books.append(ImportPreviewBook(
                    row=i + 1,
                    title=b["title"],
                    author=b["author"],
                    exists=True,
                    reason="Ya está en tu biblioteca",
                ))
            else:
                preview_books.append(ImportPreviewBook(
                    row=i + 1,
                    title=b["title"],
                    author=b["author"],
                    exists=False,
                    reason="Libro global existe, se agregará a tu biblioteca",
                ))
        else:
            preview_books.append(ImportPreviewBook(
                row=i + 1,
                title=b["title"],
                author=b["author"],
                exists=False,
                reason="Nuevo libro",
            ))

    return ImportPreviewResponse(
        total=len(books_data),
        books=preview_books,
    )
