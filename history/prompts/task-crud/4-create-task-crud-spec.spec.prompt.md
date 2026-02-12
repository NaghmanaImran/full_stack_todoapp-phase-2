---
id: 4
title: "Create Task CRUD Spec"
stage: spec
date_iso: "2026-02-07"
surface: "agent"
model: "claude-sonnet-4-5-20250929"
feature: "task-crud"
branch: "master"
user: "HP"
command: "manual spec creation"
labels: ["spec", "task-crud", "full-stack", "todo-app"]
links:
  spec: "specs/features/task-crud.md"
  ticket: null
  adr: null
  pr: null
files_yaml:
  - "specs/features/task-crud.md"
tests_yaml: []
---

# Task CRUD Spec Creation

## User Input
```
Follow /sp.constitution strictly in every aspect: structure, principles (especially Security First, Modularity & Layering, Clarity for Agentic Coding), required sections (Overview, User Stories, Acceptance Criteria, Technical Details, Edge Cases, Dependencies/References), constraints (Phase II scope only: Task CRUD + Auth + Neon DB, monorepo, Next.js App Router + TypeScript + Tailwind, FastAPI + SQLModel, no manual code — describe WHAT + HOW to verify), and success criteria.

This is the instruction to generate **Spec 3** of Phase II — the final spec that implements the core todo functionality across the full stack.

Generate the complete content for the following spec file:

File path to create/update: specs/features/task-crud.md

Spec title / purpose: Task CRUD Operations & Full-Stack Implementation (Multi-User)

Overview:
This spec defines the complete task management feature: RESTful CRUD endpoints for tasks, frontend UI for listing/creating/editing/deleting/toggling tasks, responsive design with Tailwind, and full integration with authentication (JWT-protected) and database (scoped to current user). All operations enforce ownership — users only see/modify their own tasks. API base: /api/tasks (no user_id in path — middleware filters by authenticated user_id). Use Next.js App Router server/client components wisely, Tailwind for styling, and a typed API client for backend calls.

Key invariants:
- Every endpoint requires valid JWT → 401 if missing/invalid
- All task queries filtered by user_id = authenticated user (from JWT)
- Create: task auto-assigned to current user
- Update/Delete/Complete: fail with 403 if task.user_id != current user
- Frontend: protected pages/routes (redirect to login if unauthenticated), JWT attached to every API call

User Stories:
- As a logged-in user, I can view my list of tasks (title, description, completed status, dates)
- As a logged-in user, I can create a new task with required title and optional description
- As a logged-in user, I can update a task's title/description
- As a logged-in user, I can delete a task
- As a logged-in user, I can toggle a task's completion status
- As a user, the UI is responsive and intuitive (mobile-friendly with Tailwind)

Acceptance Criteria:
- Endpoints (all under /api/tasks):
  - GET /api/tasks ?status=all|pending|completed &sort=created|title|due_date → list of current user's tasks (JSON array)
  - POST /api/tasks {title: str (1-200), description?: str (≤1000)} → create task for current user, return created object
  - GET /api/tasks/{task_id} → get single task (404 if not found or not owned)
  - PUT /api/tasks/{task_id} {title?, description?} → update (403 if not owned)
  - DELETE /api/tasks/{task_id} → delete (403 if not owned)
  - PATCH /api/tasks/{task_id}/complete {completed: bool} → toggle complete (403 if not owned)
- Frontend:
  - Protected layout/route group (e.g. /app/(protected)/tasks/page.tsx) checks session/JWT
  - Task list page: table or cards showing tasks, filter by status, sort options
  - Create form modal/page, edit form, delete confirmation, toggle checkbox/button
  - Use Tailwind classes for responsive grid/flex, dark mode support if possible
  - API client in lib/api.ts: typed fetch wrapper that adds Authorization: Bearer <token> from authClient.token() or session
- Integration:
  - Use Depends(get_current_user) in every FastAPI route → get user_id
  - Task queries: .where(Task.user_id == user_id)
  - Error responses: JSON {detail: "..."} with proper status (401, 403, 404, 422 validation)
- Validation: Pydantic/SQLModel for request bodies, title required/not empty

Technical Details:
- Backend:
  - Routes in routes/tasks.py, use APIRouter(prefix="/api/tasks")
  - Dependency: current_user_id = Depends(get_current_user) → str
  - CRUD operations via SQLModel session.exec(select(Task).where(...))
  - For toggle: PATCH updates completed field
- Frontend:
  - Use better-auth client + jwtClient plugin to get token
  - Protected pages: use useSession() or server-side check, redirect if unauthenticated
  - Components: TaskCard, TaskForm, TaskList with Tailwind (e.g. grid-cols-1 md:grid-cols-2)
  - API calls: await api.get("/tasks"), api.post("/tasks", data), etc.
- Shared: lib/api.ts with baseURL from env NEXT_PUBLIC_API_URL (http://localhost:8000 in dev)

Edge Cases:
- Unauthenticated API call → 401
- Try to access/update/delete another user's task → 403
- Empty task list → show "No tasks yet" UI
- Invalid input (title too long/empty) → 422 with field errors
- Concurrent toggle → optimistic UI update + revalidate if needed
- Slow Neon query → loading states/spinners in UI

Dependencies/References:
- @specs/features/authentication.md (JWT verification, get_current_user dependency)
- @specs/database/schema.md (Task model fields, user_id FK, indexes)
- Better Auth client: https://better-auth.com/docs/client
- FastAPI dependencies: https://fastapi.tiangolo.com/tutorial/dependencies/
- Tailwind responsive: https://tailwindcss.com/docs/responsive-design

Output ONLY the full Markdown content of specs/fea
```

## Response Summary
Created the task CRUD spec file (specs/features/task-crud.md) following the constitution's requirements with sections for Overview, User Stories, Acceptance Criteria, Technical Details, Edge Cases, Dependencies/References, Environment Variables, and Testing Strategy. The spec covers the complete full-stack implementation of task management functionality with proper authentication and user isolation.

## Outcome
The task CRUD spec has been successfully created with all required sections and details for implementing the core todo functionality in the Todo Full-Stack Web Application.

## Evaluation
The spec follows the constitution's principles of Security First, Modularity & Layering, and Clarity for Agentic Coding, with clear acceptance criteria and technical implementation details for the full-stack task management feature.