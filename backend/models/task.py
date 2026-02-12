from sqlmodel import SQLModel, Field, Column
from typing import Optional
from datetime import datetime
from sqlalchemy import DateTime, Index, text
from enum import Enum


class Priority(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"


class Status(str, Enum):
    pending = "pending"
    in_progress = "in-progress"
    completed = "completed"


class Task(SQLModel, table=True):
    __tablename__ = "tasks"

    # Define indexes
    __table_args__ = (
        Index('idx_user_id', 'user_id'),
        Index('idx_user_completed', 'user_id', 'completed'),
        Index('idx_user_priority', 'user_id', 'priority'),
        Index('idx_user_status', 'user_id', 'status'),
        Index('idx_created_at', 'created_at'),
    )

    id: int = Field(default=None, primary_key=True)
    user_id: str = Field(index=True, nullable=False)  # Foreign key to users.id (Better Auth user id is string)
    title: str = Field(max_length=200, nullable=False)  # Required, max 200 chars
    description: Optional[str] = Field(max_length=1000)  # Optional, max 1000 chars
    priority: Priority = Field(default=Priority.medium)  # low, medium, high
    status: Status = Field(default=Status.pending)  # pending, in-progress, completed
    completed: bool = Field(default=False)  # Default False (maintaining for backward compatibility)
    created_at: datetime = Field(sa_column=Column(DateTime, server_default=text("CURRENT_TIMESTAMP")))
    updated_at: datetime = Field(sa_column=Column(DateTime, server_default=text("CURRENT_TIMESTAMP"), onupdate=datetime.now))