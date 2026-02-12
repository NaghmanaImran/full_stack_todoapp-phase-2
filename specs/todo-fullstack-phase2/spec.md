# Todo Full-Stack Web Application - Phase II (Multi-User with Auth + Neon DB)

## Overview

Transform the console todo app into a secure, multi-user web application with persistent storage using Next.js frontend, FastAPI backend, Neon Serverless PostgreSQL database, and Better Auth for authentication. The application will provide full user isolation via JWT tokens and ownership checks, ensuring no data leaks between users.

## Target Audience

Claude Code agent for agentic, spec-driven full-stack implementation.

## Success Criteria

- All 5 basic features implemented as web app: list tasks, create, get details, update, delete, toggle complete
- Full user isolation via JWT + ownership checks (no data leaks)
- Responsive frontend UI with Tailwind CSS
- REST API under /api/tasks with proper auth middleware
- Data stored in Neon Serverless PostgreSQL using SQLModel
- Authentication via Better Auth (frontend) + JWT plugin → FastAPI backend verifies via JWKS (preferred) or shared secret
- End-to-end testable: signup → login → JWT fetch → API calls → task CRUD → logout
- Zero manual coding in specs/plans — only describe WHAT + HOW to verify + references

## Scope & Constraints

### In Scope (Phase II)
- Task CRUD operations (list, create, get, update, delete, toggle complete)
- Authentication system with Better Auth
- Neon Serverless PostgreSQL persistence
- Responsive Next.js frontend with Tailwind
- FastAPI backend with proper middleware
- JWT-based user isolation

### Out of Scope (Not Building)
- Phase III AI chatbot integration
- Advanced filtering/sorting beyond basic status (unless in spec)
- Real-time updates (websockets)
- Mobile app or PWA manifest
- Production deployment (Vercel/Netlify/Docker only for local)
- Extensive error logging/monitoring (basic HTTP exceptions only)

### Technical Constraints
- Monorepo structure: frontend/ (Next.js 16+ App Router, TypeScript, Tailwind), backend/ (FastAPI, SQLModel, Python 3.11+), specs/, .spec-kit/config.yaml, CLAUDE.md files
- Use free-tier Neon PostgreSQL only (no other paid DB/services)
- Auth: Prefer asymmetric JWKS verification (Better Auth exposes /api/auth/jwks), fallback to symmetric BETTER_AUTH_SECRET shared env var
- API endpoints: /api/tasks (GET/POST), /api/tasks/{id} (GET/PUT/DELETE), /api/tasks/{id}/complete (PATCH) — no {user_id} in path
- Frontend: Protected routes, api client with JWT attachment, responsive (mobile-first Tailwind)
- Timeline: Complete Phase II in sequential agentic steps (setup → auth → db → backend → frontend → test)

## Functional Requirements

### User Authentication
- As a new user, I want to register with email/password
- As an existing user, I want to login with my credentials
- As an authenticated user, I want to securely store my session
- As a user, I want to log out and clear my session

### Task Management
- As a logged-in user, I want to view my list of tasks
- As a logged-in user, I want to create new tasks with title and description
- As a logged-in user, I want to view details of a specific task
- As a logged-in user, I want to update my tasks' information
- As a logged-in user, I want to delete my tasks
- As a logged-in user, I want to toggle the completion status of my tasks

### Data Isolation
- As the system, I want to ensure no user's data is accessible by another user
- As the system, I want to enforce ownership checks on all operations

### User Interface
- As a user, I want a responsive UI that works on desktop and mobile
- As a user, I want intuitive navigation and clear feedback
- As a user, I want visual indicators for task completion status

## Non-Functional Requirements

### Security
- All API endpoints must require authentication except public ones
- JWT tokens must be validated against JWKS or shared secret
- All database queries must be scoped to authenticated user ID
- No sensitive information should be exposed in error messages

### Performance
- API responses should be under 2 seconds in development environment
- Database queries should utilize appropriate indexes
- Frontend should implement loading states for API calls

### Usability
- UI should be responsive and mobile-friendly
- Forms should provide clear validation feedback
- Loading states should be visible during API operations

## API Specification

### Authentication Endpoints
- POST /api/auth/register - User registration
- POST /api/auth/login - User login
- POST /api/auth/logout - User logout

### Task Endpoints
- GET /api/tasks - List user's tasks with optional filtering (status, sorting)
- POST /api/tasks - Create a new task for authenticated user
- GET /api/tasks/{id} - Get a specific task
- PUT /api/tasks/{id} - Update a task
- DELETE /api/tasks/{id} - Delete a task
- PATCH /api/tasks/{id}/complete - Toggle task completion status

### Expected Request/Response Formats
- Requests: JSON with appropriate validation
- Responses: JSON with proper HTTP status codes
- Error responses: {detail: "error message"} with appropriate status codes (401, 403, 404, 422)

## Data Model

### Task Entity
- id: Integer (Primary Key, Auto-increment)
- user_id: String (Foreign Key to Better Auth user ID)
- title: String (Required, max 200 characters)
- description: String (Optional, max 1000 characters)
- completed: Boolean (Default: false)
- created_at: DateTime (Auto-set on creation)
- updated_at: DateTime (Auto-updated on modification)

## Technology Stack

### Frontend
- Next.js 16+ with App Router
- TypeScript
- Tailwind CSS
- Better Auth client with JWT plugin

### Backend
- FastAPI
- Python 3.11+
- SQLModel
- python-jose for JWT verification

### Database
- Neon Serverless PostgreSQL
- Free tier limitations apply

### Authentication
- Better Auth with JWT plugin
- JWKS-based verification (preferred) or shared secret

## Testing Strategy

### End-to-End Test Flow
1. User registration
2. User login and JWT token acquisition
3. Task creation using API
4. Task listing and verification
5. Task updates
6. Task deletion
7. Logout

### Security Tests
- Verify unauthorized access returns 401
- Verify user isolation (one user cannot access another's data)
- Verify JWT token validation

### Functional Tests
- All CRUD operations
- Input validation
- Error handling

## Dependencies/References

- @specs/features/authentication.md - Authentication and security infrastructure
- @specs/database/schema.md - Database schema and models
- @specs/features/task-crud.md - Task CRUD operations and full-stack implementation