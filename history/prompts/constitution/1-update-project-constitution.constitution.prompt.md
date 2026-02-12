---
id: 1
title: "Update Project Constitution"
stage: constitution
date_iso: "2026-02-07"
surface: "agent"
model: "claude-sonnet-4-5-20250929"
feature: "none"
branch: "master"
user: "HP"
command: "/sp.constitution"
labels: ["constitution", "setup", "todo-app"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files_yaml:
  - ".specify/memory/constitution.md"
tests_yaml: []
---

# Constitution Update

## User Input
```
/sp.constitution
Project: Todo Full-Stack Web Application - Phase II (Multi-user with Authentication)
Core principles:
- Spec-Driven Development: Every spec must be clear, actionable, structured, and directly usable by Claude Code or similar agent to implement code.
- Security First: Enforce user isolation, JWT validation, and ownership checks in every relevant operation.
- Modularity & Layering: Separate concerns (auth, database, features/UI/API) for clean referencing and implementation.
- Clarity for Agentic Coding: Use markdown headings, numbered lists, code blocks, @references to other specs, and precise acceptance criteria.
- Reproducibility: Include exact commands, env var names, file paths, and verification steps.
Key standards:
- Format: Markdown with sections: Overview, User Stories, Acceptance Criteria, Technical Details, Edge Cases, Dependencies/References.
- API: All endpoints RESTful, under /api/, return JSON, use HTTP status codes properly.
- Auth: Use Better Auth (frontend) + JWT plugin for token issuance → FastAPI verifies with PyJWT or similar using shared secret.
- Database: SQLModel models, Neon PostgreSQL via DATABASE_URL env var.
- No manual code in spec: Describe WHAT to build and HOW to verify, not the final code lines.
- References: Use @specs/... syntax when one spec depends on another.
Constraints:
- Scope limited to Phase II: Task CRUD (list/create/get/update/delete/toggle complete) + Authentication + Neon DB persistence.
- Monorepo structure only: frontend/ (Next.js), backend/ (FastAPI), specs/, .spec-kit/config.yaml.
- Use free-tier Neon PostgreSQL, no other paid external services.
- Frontend: Next.js App Router, TypeScript, Tailwind CSS.
- Backend: FastAPI, SQLModel, Python 3.11+.
Success criteria:
- Spec is complete enough
```

## Response Summary
Updated the project constitution file (.specify/memory/constitution.md) with specific principles and constraints for the Todo Full-Stack Web Application project. The constitution now includes core principles for spec-driven development, security, modularity, clarity for agentic coding, and reproducibility. It also defines technology stack constraints, API standards, authentication requirements, database standards, and development workflow guidelines.

## Outcome
The constitution file has been successfully updated with project-specific principles and constraints that will guide the development of the Todo Full-Stack Web Application.

## Evaluation
The updated constitution properly reflects all the specified core principles, technology stack constraints, and development workflow requirements provided by the user.