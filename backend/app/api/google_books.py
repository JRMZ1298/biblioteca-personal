from fastapi import APIRouter, Depends, HTTPException, Query
from httpx import Client
from app.core.config import get_settings
from app.core.deps import get_current_user
from app.models.user import User
from app.schemas.google_books import GoogleBooksResponse

router = APIRouter()


@router.get("/search", response_model=GoogleBooksResponse)
def search_google_books(
    q: str = Query(..., min_length=1),
    current_user: User = Depends(get_current_user),
):
    settings = get_settings()
    url = "https://www.googleapis.com/books/v1/volumes"
    params = {"q": q, "key": settings.GOOGLE_BOOKS_API_KEY, "maxResults": 10}

    with Client() as client:
        response = client.get(url, params=params)

    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="Google Books API error")

    data = response.json()
    return GoogleBooksResponse(**data)
