# Task CRUD Operations & Full-Stack Implementation (Multi-User)

## Overview

This spec defines the complete task management feature: RESTful CRUD endpoints for tasks, frontend UI for listing/creating/editing/deleting/toggling tasks, responsive design with Tailwind, and full integration with authentication (JWT-protected) and database (scoped to current user). All operations enforce ownership — users only see/modify their own tasks. API base: /api/tasks (no user_id in path — middleware filters by authenticated user_id). Use Next.js App Router server/client components wisely, Tailwind for styling, and a typed API client for backend calls.

## User Stories

### Story 1: View Tasks
As a logged-in user, I can view my list of tasks (title, description, completed status, dates).

### Story 2: Create Task
As a logged-in user, I can create a new task with required title and optional description.

### Story 3: Update Task
As a logged-in user, I can update a task's title/description.

### Story 4: Delete Task
As a logged-in user, I can delete a task.

### Story 5: Toggle Task Completion
As a logged-in user, I can toggle a task's completion status.

### Story 6: Responsive UI
As a user, the UI is responsive and intuitive (mobile-friendly with Tailwind).

## Acceptance Criteria

### Backend API Endpoints (all under /api/tasks)
- [ ] GET /api/tasks ?status=all|pending|completed &sort=created|title|due_date → list of current user's tasks (JSON array)
- [ ] POST /api/tasks {title: str (1-200), description?: str (≤1000)} → create task for current user, return created object
- [ ] GET /api/tasks/{task_id} → get single task (404 if not found or not owned)
- [ ] PUT /api/tasks/{task_id} {title?, description?} → update (403 if not owned)
- [ ] DELETE /api/tasks/{task_id} → delete (403 if not owned)
- [ ] PATCH /api/tasks/{task_id}/complete {completed: bool} → toggle complete (403 if not owned)

### Frontend Requirements
- [ ] Protected layout/route group (e.g. /app/(protected)/tasks/page.tsx) checks session/JWT
- [ ] Task list page: table or cards showing tasks, filter by status, sort options
- [ ] Create form modal/page, edit form, delete confirmation, toggle checkbox/button
- [ ] Use Tailwind classes for responsive grid/flex, dark mode support if possible
- [ ] API client in lib/api.ts: typed fetch wrapper that adds Authorization: Bearer <token> from authClient.token() or session

### Security & Integration Requirements
- [ ] Every endpoint requires valid JWT → 401 if missing/invalid
- [ ] All task queries filtered by user_id = authenticated user (from JWT)
- [ ] Create: task auto-assigned to current user
- [ ] Update/Delete/Complete: fail with 403 if task.user_id != current user
- [ ] Use Depends(get_current_user) in every FastAPI route → get user_id
- [ ] Task queries: .where(Task.user_id == user_id)
- [ ] Error responses: JSON {detail: "..."} with proper status (401, 403, 404, 422 validation)

### Validation Requirements
- [ ] Pydantic/SQLModel for request bodies, title required/not empty
- [ ] Input validation on both frontend and backend
- [ ] Proper error messages for validation failures

## Technical Details

### Backend Implementation
- Routes in routes/tasks.py, use APIRouter(prefix="/api/tasks")
- Dependency: current_user_id = Depends(get_current_user) → str
- CRUD operations via SQLModel session.exec(select(Task).where(...))
- For toggle: PATCH updates completed field
- Install: pip install python-multipart for form handling
- Use Pydantic models for request/response validation

### Frontend Implementation
- Use better-auth client + jwtClient plugin to get token
- Protected pages: use useSession() or server-side check, redirect if unauthenticated
- Components: TaskCard, TaskForm, TaskList with Tailwind (e.g. grid-cols-1 md:grid-cols-2)
- API calls: await api.get("/tasks"), api.post("/tasks", data), etc.
- Use React hooks for state management (useState, useEffect, etc.)
- Implement optimistic UI updates where appropriate

### Shared Components
- lib/api.ts with baseURL from env NEXT_PUBLIC_API_URL (http://localhost:8000 in dev)
- Shared TypeScript interfaces for Task model
- Error handling utilities for both success and failure cases

### API Response Format
- Success: Return appropriate JSON objects with 200/201 status
- Errors: Return JSON {detail: "..."} with proper status codes
- List responses: Return array of task objects with pagination if needed

## Edge Cases

### Authentication & Authorization
- [ ] Unauthenticated API call → 401 Unauthorized
- [ ] Try to access/update/delete another user's task → 403 Forbidden
- [ ] Invalid JWT token → 401 Unauthorized

### Input Validation
- [ ] Empty task list → show "No tasks yet" UI
- [ ] Invalid input (title too long/empty) → 422 with field errors
- [ ] Missing required fields → 422 validation error

### Performance & Concurrency
- [ ] Concurrent toggle → optimistic UI update + revalidate if needed
- [ ] Slow Neon query → loading states/spinners in UI
- [ ] Large number of tasks → pagination or virtual scrolling considerations

### UI/UX Edge Cases
- [ ] Network failure during API call → proper error display
- [ ] Form submission while offline → queue or error message
- [ ] Multiple windows/tabs → consistent state across tabs

## Dependencies/References

- @specs/features/authentication.md - For JWT verification and get_current_user dependency
- @specs/database/schema.md - For Task model fields, user_id FK, and indexes
- Better Auth client: https://better-auth.com/docs/client
- FastAPI dependencies: https://fastapi.tiangolo.com/tutorial/dependencies/
- Tailwind responsive: https://tailwindcss.com/docs/responsive-design
- Next.js App Router: https://nextjs.org/docs/app/building-your-application/routing

## Environment Variables

### Frontend
- NEXT_PUBLIC_API_URL - Base URL for backend API (e.g. http://localhost:8000)

### Backend
- DATABASE_URL - Connection string for Neon PostgreSQL
- BETTER_AUTH_SECRET - Shared secret for JWT verification

## Testing Strategy

### Manual Testing
1. Create a task and verify it appears in the list
2. Update a task and verify the changes persist
3. Toggle a task's completion status and verify
4. Delete a task and verify it's removed
5. Verify that another user cannot access the first user's tasks
6. Test all filter and sort options
7. Test error scenarios (invalid input, unauthorized access)

### Automated Testing
- Unit tests for backend API endpoints
- Integration tests for authentication middleware
- Frontend component tests for UI interactions
- End-to-end tests for complete user workflows
- Security tests for authorization enforcement