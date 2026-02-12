---
id: 3
title: "Create Database Schema Spec"
stage: spec
date_iso: "2026-02-07"
surface: "agent"
model: "claude-sonnet-4-5-20250929"
feature: "database"
branch: "master"
user: "HP"
command: "manual spec creation"
labels: ["spec", "database", "schema", "todo-app"]
links:
  spec: "specs/database/schema.md"
  ticket: null
  adr: null
  pr: null
files_yaml:
  - "specs/database/schema.md"
tests_yaml: []
---

# Database Schema Spec Creation

## User Input
```
Follow /sp.constitution strictly in every aspect: structure, principles (especially Security First, Modularity & Layering, Clarity for Agentic Coding), required sections (Overview, User Stories, Acceptance Criteria, Technical Details, Edge Cases, Dependencies/References), constraints (Phase II scope, monorepo, Neon free-tier, SQLModel, no manual code — describe WHAT + HOW to verify), and success criteria.

This is the instruction to generate **Spec 2** of Phase II.

Generate the complete content for the following spec file:

File path to create/update: specs/database/schema.md

Spec title / purpose: Database Schema, Models & Persistence Layer

Overview:
This spec defines the persistent storage layer for the multi-user todo application using Neon Serverless PostgreSQL and SQLModel (which combines SQLAlchemy + Pydantic). It includes connection setup, model definitions (tasks table with foreign key to users.id from Better Auth), required indexes for performance, environment variables, basic migration/setup instructions, and ownership enforcement invariants at the query level. The users table is managed externally by Better Auth — we only reference its id.

Key invariants:
- Every task MUST belong to exactly one user (user_id NOT NULL foreign key)
- All read/write operations on tasks MUST be scoped to the authenticated user's ID (enforced in every repository/service layer or query)
- Use async SQLAlchemy engine for FastAPI compatibility
- Connection string comes from env var DATABASE_URL (Neon provides this)

User Stories:
- As a logged-in user, my tasks are stored persistently and survive browser refresh/server restart
- As the system, I ensure no user's tasks are visible or modifiable by another user
- As a developer, I can easily connect to Neon PostgreSQL in dev and production using one env var
- As a developer, I can run initial schema creation / migrations without manual SQL

Acceptance Criteria:
- Models defined with SQLModel: Task model with id (int PK), user_id (str FK → users.id), title (str not null, max 200), description (str | None, max 1000), completed (bool default False), created_at & updated_at (datetime with server_default & onupdate)
- users.id is treated as string (Better Auth uses UUID strings by default)
- ForeignKey constraint: tasks.user_id references users.id ON DELETE CASCADE (optional but recommended)
- Indexes: index on tasks.user_id, composite index on (user_id, completed) for status filtering
- Database connection in backend/db.py: async engine from DATABASE_URL, sessionmaker with expire_on_commit=False
- Environment var: DATABASE_URL (Neon format: postgres://user:pass@host/dbname?sslmode=require)
- No plaintext credentials in code — all via env var
- Basic setup command: e.g. run a script or alembic migration to create tables (describe steps, no full migration code)
- Ownership rule documented: every task query MUST include .where(Task.user_id == current_user_id)

Technical Details:
- Install: pip install sqlmodel asyncpg
- Model example skeleton (describe fields, constraints, indexes — no full code block unless very short)
- Connection setup: use sqlalchemy.ext.asyncio.create_async_engine(DATABASE_URL, echo=False)
- AsyncSession dependency for FastAPI routes
- Recommended: create a base repository pattern or query helper that always injects user_id filter
- Neon specifics: use ?sslmode=require in URL, prefer connection pooling (asyncpg does this)

Edge Cases:
- Invalid DATABASE_URL → connection error on startup (should fail fast)
- User_id mismatch during write → should raise 403 (handled in service layer, not DB constraint)
- Neon connection timeout / cold start → FastAPI should handle gracefully (retry or 503)
- Deleting user (via Better Auth) → tasks cascade delete if ON DELETE CASCADE
- Large number of tasks per user → index prevents slow queries

Dependencies/References:
- @specs/features/authentication.md (for user.id shape and current_user extraction)
- Neon docs: https://neon.tech/docs/connect/connectivity
- SQLModel docs: https://sqlmodel.tiangolo.com/
- FastAPI as
```

## Response Summary
Created the database schema spec file (specs/database/schema.md) following the constitution's requirements with sections for Overview, User Stories, Acceptance Criteria, Technical Details, Edge Cases, Dependencies/References, Environment Variables, and Testing Strategy. The spec covers SQLModel model definitions, Neon PostgreSQL connection setup, and user ownership enforcement for the Todo application.

## Outcome
The database schema spec has been successfully created with all required sections and details for implementing the persistence layer in the Todo Full-Stack Web Application.

## Evaluation
The spec follows the constitution's principles of Security First, Modularity & Layering, and Clarity for Agentic Coding, with clear acceptance criteria and technical implementation details for the database layer.