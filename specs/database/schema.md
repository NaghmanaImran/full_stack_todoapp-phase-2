# Database Schema, Models & Persistence Layer

## Overview

This spec defines the persistent storage layer for the multi-user todo application using Neon Serverless PostgreSQL and SQLModel (which combines SQLAlchemy + Pydantic). It includes connection setup, model definitions (tasks table with foreign key to users.id from Better Auth), required indexes for performance, environment variables, basic migration/setup instructions, and ownership enforcement invariants at the query level. The users table is managed externally by Better Auth — we only reference its id.

## User Stories

### Story 1: Persistent Task Storage
As a logged-in user, my tasks are stored persistently and survive browser refresh/server restart.

### Story 2: Data Isolation
As the system, I ensure no user's tasks are visible or modifiable by another user.

### Story 3: Easy Database Connection
As a developer, I can easily connect to Neon PostgreSQL in dev and production using one env var.

### Story 4: Schema Management
As a developer, I can run initial schema creation / migrations without manual SQL.

## Acceptance Criteria

### Database Model Definition
- [ ] Task model defined with SQLModel including: id (int PK), user_id (str FK → users.id), title (str not null, max 200), description (str | None, max 1000), completed (bool default False), created_at & updated_at (datetime with server_default & onupdate)
- [ ] users.id is treated as string (Better Auth uses UUID strings by default)
- [ ] ForeignKey constraint: tasks.user_id references users.id ON DELETE CASCADE (optional but recommended)

### Database Indexes
- [ ] Index on tasks.user_id for performance
- [ ] Composite index on (user_id, completed) for status filtering

### Database Connection Setup
- [ ] Database connection in backend/db.py: async engine from DATABASE_URL, sessionmaker with expire_on_commit=False
- [ ] Use async SQLAlchemy engine for FastAPI compatibility
- [ ] Connection string comes from env var DATABASE_URL (Neon provides this)

### Environment Configuration
- [ ] Environment var: DATABASE_URL (Neon format: postgres://user:pass@host/dbname?sslmode=require)
- [ ] No plaintext credentials in code — all via env var

### Schema Setup
- [ ] Basic setup command: e.g. run a script or alembic migration to create tables (describe steps, no full migration code)
- [ ] Ownership rule documented: every task query MUST include .where(Task.user_id == current_user_id)

## Technical Details

### Required Dependencies
- Install: pip install sqlmodel asyncpg

### Task Model Fields
- id: Integer primary key, auto-incrementing
- user_id: String foreign key referencing users.id from Better Auth, NOT NULL
- title: String, max length 200, NOT NULL
- description: Optional string, max length 1000
- completed: Boolean, default False
- created_at: DateTime with server_default for creation timestamp
- updated_at: DateTime with onupdate for modification timestamp

### Database Connection
- Use sqlalchemy.ext.asyncio.create_async_engine(DATABASE_URL, echo=False)
- AsyncSession dependency for FastAPI routes
- Neon specifics: use ?sslmode=require in URL, prefer connection pooling (asyncpg does this)

### Repository Pattern
- Recommended: create a base repository pattern or query helper that always injects user_id filter
- Every task query must include .where(Task.user_id == current_user_id) for ownership enforcement

### Neon Configuration
- Use Neon Serverless PostgreSQL with free-tier limitations
- Connection pooling handled by asyncpg
- SSL mode required for Neon connectivity

## Edge Cases

### Connection Issues
- [ ] Invalid DATABASE_URL → connection error on startup (should fail fast)
- [ ] Neon connection timeout / cold start → FastAPI should handle gracefully (retry or 503)

### Data Integrity
- [ ] User_id mismatch during write → should raise 403 (handled in service layer, not DB constraint)
- [ ] Deleting user (via Better Auth) → tasks cascade delete if ON DELETE CASCADE
- [ ] Large number of tasks per user → index prevents slow queries

### Performance
- [ ] High concurrent access → connection pooling handles efficiently
- [ ] Long-running queries → timeout and error handling in place
- [ ] Database migration failures → rollback mechanism in place

## Dependencies/References

- @specs/features/authentication.md - For user.id shape and current_user extraction
- Neon docs: https://neon.tech/docs/connect/connectivity
- SQLModel docs: https://sqlmodel.tiangolo.com/
- FastAPI async SQLAlchemy integration guides
- @specs/features/task-crud.md - For how tasks will be accessed and manipulated

## Environment Variables

### Backend
- DATABASE_URL - Connection string for Neon PostgreSQL in format: postgres://user:pass@host/dbname?sslmode=require

## Testing Strategy

### Manual Testing
1. Create a new task for a user
2. Verify the task is stored in the database
3. Log in as a different user and verify the first user's tasks are not visible
4. Update a task and verify the updated_at timestamp changes
5. Mark a task as complete and verify the change persists

### Automated Testing
- Unit tests for database model definitions
- Integration tests for database connection
- Tests for user isolation enforcement
- Migration verification tests