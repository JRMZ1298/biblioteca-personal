"""add notes table

Revision ID: 98b45af69b58
Revises: 0f8afeee3156
Create Date: 2026-05-20 16:46:36.029156

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '98b45af69b58'
down_revision: Union[str, Sequence[str], None] = '0f8afeee3156'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_column('user_books', 'notes')


def downgrade() -> None:
    op.add_column('user_books', sa.Column('notes', sa.VARCHAR(length=2000), nullable=True))
