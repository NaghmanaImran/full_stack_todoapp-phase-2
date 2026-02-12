



<!--
Sync Impact Report:
- Version change: 1.0.0 → 1.1.0
- Modified principles: All placeholder principles replaced with specific project principles
- Added sections: None
- Removed sections: None
- Templates requiring updates: ✅ updated / ⚠ pending
- Follow-up TODOs: None
-->
# Todo Full-Stack Web Application Constitution

## Core Principles

### Spec-Driven Development
Every spec must be clear, actionable, structured, and directly usable by Claude Code or similar agent to implement code.

### Security First
Enforce user isolation, JWT validation, and ownership checks in every relevant operation.

### Modularity & Layering
Separate concerns (auth, database, features/UI/API) for clean referencing and implementation.

### Clarity for Agentic Coding
Use markdown headings, numbered lists, code blocks, @references to other specs, and precise acceptance criteria.

### Reproducibility
Include exact commands, env var names, file paths, and verification steps.

## Technology Stack Constraints

### API Standards
All endpoints RESTful, under /api/, return JSON, use HTTP status codes properly.

### Authentication Requirements
Use Better Auth (frontend) + JWT plugin for token issuance → FastAPI verifies with PyJWT or similar using shared secret.

### Database Standards
SQLModel models, Neon PostgreSQL via DATABASE_URL env var.

### Frontend Technology
Next.js App Router, TypeScript, Tailwind CSS.

### Backend Technology
FastAPI, SQLModel, Python 3.11+.

## Development Workflow

### Specification Requirements
No manual code in spec: Describe WHAT to build and HOW to verify, not the final code lines. Format: Markdown with sections: Overview, User Stories, Acceptance Criteria, Technical Details, Edge Cases, Dependencies/References.

### Project Structure
Monorepo structure only: frontend/ (Next.js), backend/ (FastAPI), specs/, .spec-kit/config.yaml.

### Service Limitations
Use free-tier Neon PostgreSQL, no other paid external services.

### Scope Limitations
Scope limited to Phase II: Task CRUD (list/create/get/update/delete/toggle complete) + Authentication + Neon DB persistence.

## Governance

All specifications must follow the agentic dev stack workflow: Write spec → Generate plan → Break into tasks → Implement via Claude Code. No manual coding allowed. Specifications must include references using @specs/... syntax when one spec depends on another.

**Version**: 1.1.0 | **Ratified**: 2026-02-07 | **Last Amended**: 2026-02-07
