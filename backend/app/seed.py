from sqlalchemy import select
from app.core.database import SessionLocal
from app.models.genre import Genre

GENRES = [
    "Fantasy",
    "Science Fiction",
    "Romance",
    "Thriller",
    "Mystery",
    "Horror",
    "Historical",
    "Adventure",
    "Drama",
    "Poetry",
    "Biography",
    "Self Help",
    "Technology",
    "Business",
    "Philosophy",
    "Psychology",
    "Manga",
    "Comics",
    "Young Adult",
    "Dystopian",
]


def seed_genres(db: SessionLocal) -> None:
    for name in GENRES:
        stmt = select(Genre).where(Genre.name == name)
        existing = db.execute(stmt).scalar_one_or_none()
        if not existing:
            db.add(Genre(name=name))
    db.commit()


def main() -> None:
    db = SessionLocal()
    try:
        seed_genres(db)
        print(f"Seeded {len(GENRES)} genres")
    finally:
        db.close()


if __name__ == "__main__":
    main()
