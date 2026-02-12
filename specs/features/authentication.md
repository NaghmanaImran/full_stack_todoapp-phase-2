# Authentication & Security Infrastructure for Multi-User Todo App

## Overview

This spec defines the complete authentication system using Better Auth on the Next.js frontend (with JWT plugin enabled for cross-service token issuance) and secure JWT verification on the FastAPI backend. The goal is stateless, secure user isolation: every API request must carry a valid JWT, backend verifies it and enforces that only the authenticated user's own tasks are visible/modifiable. No data leaks between users. Use shared secret via env var where applicable, but prefer JWKS for verification if Better Auth JWT plugin uses asymmetric keys.

## User Stories

### Story 1: User Registration and Login
As a new user, I want to register with email/password so that I can create an account and access my personal todo list.

### Story 2: Secure Session Management
As an authenticated user, I want my session to be managed securely with JWT tokens so that I can access my data across both frontend and backend services.

### Story 3: User Isolation
As a user, I want my data to be isolated from other users so that I can only see and modify my own tasks.

### Story 4: Secure API Access
As a user, I want all API requests to be authenticated so that unauthorized access to my data is prevented.

## Acceptance Criteria

### Frontend Authentication Setup
- [ ] Better Auth installed + configured with JWT plugin in frontend/ directory
- [ ] Client can call authClient.token() or equivalent to get JWT after login
- [ ] JWT is attached to every backend API fetch (via api client in lib/api.ts) as Authorization: Bearer <token>
- [ ] Frontend includes proper environment variables: NEXT_PUBLIC_BASE_URL

### Backend Authentication Verification
- [ ] Dependency/middleware that extracts Bearer token, verifies signature via JWKS (remote from http://localhost:3000/api/auth/jwks in dev)
- [ ] Middleware checks issuer/audience/exp and extracts user_id/sub from token
- [ ] All task-related queries MUST filter WHERE user_id = authenticated_user_id (enforced in every route/dependency)
- [ ] Invalid/missing token → 401 Unauthorized JSON response { detail: "..." }
- [ ] Valid token but ownership mismatch (future tasks) → 403 Forbidden
- [ ] Backend includes proper environment variables: DATABASE_URL, optionally BETTER_AUTH_SECRET if symmetric fallback

### Security Requirements
- [ ] No plaintext private keys; use default encryption in Better Auth JWT plugin
- [ ] Environment variables properly configured for both frontend and backend
- [ ] Authentication system tested end-to-end without shared session DB

### Verification Steps
- [ ] Can register a new user via frontend
- [ ] Can login and receive JWT token
- [ ] Can make authenticated API calls with JWT in Authorization header
- [ ] Different users' data is properly isolated
- [ ] Invalid tokens return 401 Unauthorized
- [ ] Expired tokens return 401 Unauthorized

## Technical Details

### Frontend Changes
- Install Better Auth with JWT plugin in frontend/ directory
- Set up auth.ts with auth client configuration using jwt() plugin
- Create lib/api.ts fetch wrapper that adds Authorization header if token exists
- Configure environment variables: NEXT_PUBLIC_BASE_URL

### Backend Changes
- Install jose library: pip install python-jose[cryptography]
- Create auth dependency in dependencies.py or middleware
- Use create_remote_jwks_set(URL) for JWT verification
- Use OAuth2PasswordBearer from fastapi.security for header extraction
- Implement get_current_user dependency that decodes JWT and returns user_id
- All protected routes use Depends(get_current_user)

### Expected JWT Payload
- At minimum: { sub: user.id, email?, exp, iat, iss: BASE_URL, aud: BASE_URL }
- Token expiration: approximately 15 minutes (configurable)
- Token must include user identifier for filtering

### API Endpoint Requirements
- All /api/* endpoints (except public ones) require valid JWT
- Backend verifies JWT and extracts user ID to scope all database queries
- Task queries must filter by authenticated_user_id

## Edge Cases

### Token Handling
- [ ] Expired token → 401 with clear message
- [ ] Malformed token → 401 with clear message
- [ ] Token signed with old key (after rotation) → handled by JWKS grace period
- [ ] No session but /token called → 401 from Better Auth
- [ ] JWKS fetch fails → graceful 500 with log (but cache JWKS in production)

### Error Scenarios
- [ ] Invalid credentials during login → proper error message
- [ ] Network issues during token verification → appropriate error handling
- [ ] Concurrent requests with expired token → consistent behavior
- [ ] Multiple device sessions → proper isolation

### Security Scenarios
- [ ] Attempt to access other users' data → 403 Forbidden
- [ ] Missing Authorization header → 401 Unauthorized
- [ ] Invalid JWT format → 401 Unauthorized
- [ ] Invalid JWT signature → 401 Unauthorized

## Dependencies/References

- @specs/features/task-crud.md - Task CRUD operations that will use authentication
- @specs/features/user-profile.md - Future user profile management
- Better Auth documentation for JWT plugin configuration
- FastAPI security documentation for OAuth2PasswordBearer
- python-jose library documentation for JWT verification
- Next.js App Router documentation for authentication patterns

## Environment Variables

### Frontend
- NEXT_PUBLIC_BASE_URL - Base URL for the application

### Backend
- DATABASE_URL - Connection string for Neon PostgreSQL
- BETTER_AUTH_SECRET - Shared secret for JWT verification (if using symmetric approach)

## Testing Strategy

### Manual Testing
1. Register a new user account
2. Verify successful login and JWT token acquisition
3. Make API calls with valid JWT and verify access
4. Make API calls with invalid/expired JWT and verify 401 response
5. Register a second user and verify data isolation
6. Verify that user A cannot access user B's data

### Automated Testing
- Unit tests for JWT verification middleware
- Integration tests for authentication flow
- End-to-end tests for user isolation
- Security tests for token validation