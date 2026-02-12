from sqlmodel import SQLModel
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from typing import AsyncGenerator
import os

# Hardcode the database URL to ensure it's correct
DATABASE_URL = "sqlite+aiosqlite:///./todo_app_test.db"

print(f"Using database URL: {DATABASE_URL}")

# Create async engine
async_engine = create_async_engine(
    DATABASE_URL,
    echo=False,
    pool_pre_ping=True,
)

print("Engine created successfully")

# Create async session maker
AsyncSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=async_engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

print("Session maker created successfully")

async def get_async_session() -> AsyncGenerator[AsyncSession, None]:
    """
    Async session generator for FastAPI dependency injection.
    Ensures proper session cleanup after each request.
    """
    async with AsyncSessionLocal() as session:
        yield session

print("Functions defined successfully")