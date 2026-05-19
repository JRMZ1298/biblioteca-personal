from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.genre import Genre
from app.schemas.genre import GenreOut

router = APIRouter()


@router.get("", response_model=list[GenreOut])
def list_genres(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    stmt = select(Genre).order_by(Genre.name)
    genres = db.execute(stmt).scalars().all()
    return [GenreOut.model_validate(g) for g in genres]
