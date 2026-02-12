---
id: 2
title: "Create Authentication Spec"
stage: spec
date_iso: "2026-02-07"
surface: "agent"
model: "claude-sonnet-4-5-20250929"
feature: "authentication"
branch: "master"
user: "HP"
command: "manual spec creation"
labels: ["spec", "authentication", "security", "todo-app"]
links:
  spec: "specs/features/authentication.md"
  ticket: null
  adr: null
  pr: null
files_yaml:
  - "specs/features/authentication.md"
tests_yaml: []
---

# Authentication Spec Creation

## User Input
```
Follow /sp.constitution strictly in every aspect: structure, principles (especially Security First, Modularity & Layering, Clarity for Agentic Coding), sections (Overview, User Stories, Acceptance Criteria, Technical Details, Edge Cases, Dependencies/References), constraints (Phase II scope only, monorepo, Next.js App Router + Tailwind, FastAPI + SQLModel, free-tier Neon, no manual code in spec — only describe WHAT + HOW to verify), and success criteria.

This is the instruction to generate **Spec 1** of Phase II.

Generate the complete content for the following spec file:

File path to create/update: specs/features/authentication.md

Spec title / purpose: Authentication & Security Infrastructure for Multi-User Todo App

Overview:
This spec defines the complete authentication system using Better Auth on the Next.js frontend (with JWT plugin enabled for cross-service token issuance) and secure JWT verification on the FastAPI backend. The goal is stateless, secure user isolation: every API request must carry a valid JWT, backend verifies it and enforces that only the authenticated user's own tasks are visible/modifiable. No data leaks between users. Use shared secret via env var where applicable, but prefer JWKS for verification if Better Auth JWT plugin uses asymmetric keys.

Key decisions from research:
- Better Auth JWT plugin exposes /api/auth/token (GET, returns { token: "ey..." }) and /api/auth/jwks (public JWKS).
- Frontend uses better-auth/client + jwtClient plugin to fetch token after login/session.
- Backend (FastAPI) verifies JWT using jose library + remote JWKS (from frontend's /api/auth/jwks) — recommended over symmetric secret for better security (asymmetric signing).
- Fallback: if symmetric, share BETTER_AUTH_SECRET env var between services (but prefer JWKS).
- Payload must include at least user.id (as sub or custom field) to filter tasks by user_id.
- Tokens expire (default ~15m, configurable).
- All /api/* endpoints (except possibly public ones later) require valid JWT → 401 Unauthorized if ming JWT and extract user ID to scope all database queries.
- As a developer, I can test auth flow end-to-end without shared session DB.

Acceptance Criteria:
- Frontend: Better Auth installed + configured with JWT plugin; client can call authClient.token() or equivalent to get JWT after login.
- JWT is attached to every backend API fetch (via api client in lib/api.ts) as Authorization: Bearer <token>.
- Backend: Dependency/middleware that extracts Bearer token, verifies signature via JWKS (remote from http://localhost:3000/api/auth/jwks in dev), checks issuer/audience/exp, extracts user_id/sub.
- All task-related queries MUST filter WHERE user_id = authenticated_user_id (enforced in every route/dependency).
- Invalid/missing token → 401 Unauthorized JSON response { detail: "..." }.
- Valid token but ownership mismatch (future tasks) → 403 Forbidden.
- Environment vars: NEXT_PUBLIC_BASE_URL, DATABASE_URL (later), optionally BETTER_AUTH_SECRET if symmetric fallback.
- No plaintext private keys; use default encryption in Better Auth JWT plugin.
- Spec includes exact verification steps/commands for testing (e.g. curl with token).

Technical Details:
- Frontend changes: auth.ts / auth client setup with jwt() plugin; lib/api.ts fetch wrapper adds Authorization header if token exists.
- Backend changes: Install jose (pip install python-jose[cryptography]); create auth dependency in dependencies.py or middleware; use create_remote_jwks_set(URL) for verification.
- Payload expectation: at minimum { sub: user.id, email?, exp, iat, iss: BASE_URL, aud: BASE_URL }.
- Use OAuth2PasswordBearer from fastapi.security for header extraction.
- Routes will use Depends(get_current_user) where get_current_user decodes & returns user_id.

Edge Cases:
- Expired token → 401 with clear message.
- Malformed token → 401.
- Token signed with old key (after rotation) → handled by JWKS grace period.
- No session but /token called → 401 from Better Auth.
- JWKS fetch fails → graceful 500 with log (but cache JWKS in production).
```

## Response Summary
Created the authentication spec file (specs/features/authentication.md) following the constitution's requirements with sections for Overview, User Stories, Acceptance Criteria, Technical Details, Edge Cases, Dependencies/References, Environment Variables, and Testing Strategy. The spec covers Better Auth integration with JWT plugin on the frontend and secure JWT verification on the FastAPI backend with user isolation.

## Outcome
The authentication spec has been successfully created with all required sections and details for implementing secure authentication in the Todo Full-Stack Web Application.

## Evaluation
The spec follows the constitution's principles of Security First, Modularity & Layering, and Clarity for Agentic Coding, with clear acceptance criteria and technical implementation details.