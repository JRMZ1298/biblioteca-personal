from fastapi import APIRouter
from app.api.auth import router as auth_router
from app.api.books import router as books_router
from app.api.stats import router as stats_router
from app.api.google_books import router as google_books_router
from app.api.genres import router as genres_router

api_router = APIRouter()

api_router.include_router(auth_router, prefix="/auth", tags=["auth"])
api_router.include_router(books_router, prefix="/books", tags=["books"])
api_router.include_router(stats_router, prefix="/stats", tags=["stats"])
api_router.include_router(google_books_router, prefix="/google-books", tags=["google-books"])
api_router.include_router(genres_router, prefix="/genres", tags=["genres"])
