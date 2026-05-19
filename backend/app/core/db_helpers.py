from sqlalchemy import func
from app.core.config import get_settings


def month_format_func(column):
    settings = get_settings()
    if "postgresql" in settings.DATABASE_URL:
        return func.to_char(column, "YYYY-MM")
    return func.strftime("%Y-%m", column)
