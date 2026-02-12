from sqlmodel import SQLModel
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from typing import AsyncGenerator
import os

# Explicitly set database URL to SQLite
DATABASE_URL = "sqlite+aiosqlite:///./todo_app.db"

# Create async engine
async_engine = create_async_engine(
    DATABASE_URL,
    echo=False,  # Set to True for SQL query logging
    pool_pre_ping=True,  # Verify connections before use
)

# Create async session maker
AsyncSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=async_engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


async def get_async_session() -> AsyncGenerator[AsyncSession, None]:
    """
    Async session generator for FastAPI dependency injection.
    Ensures proper session cleanup after each request.
    """
    async with AsyncSessionLocal() as session:
        yield session


async def create_tables():
    """
    Create all tables in the database.
    This function should be called on application startup.
    """
    async with async_engine.begin() as conn:
        # Create tables
        await conn.run_sync(SQLModel.metadata.create_all)