# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

# Monorepo layout

- `apps/web` — Next.js public site (read-only). `apps/admin` — Next.js admin dashboard, separate app on :3001. Neither imports a database or content data directly; both call the services through `packages/api-client` (server only). They share no React components — each keeps its own copy of the shadcn primitives under `app/ui`.
- `services/content-service` — Fastify + Drizzle + Postgres. Editable content and its seed data.
- `services/quran-service`, `services/prayer-service` — Fastify.
- `packages/shared-types` — API contracts. Types only; keep it free of runtime code.
- `packages/api-client` — service fetch clients, plain TS source consumed via `transpilePackages`.

One `.env` at the repo root (see `.env.example`). See `README.md` for how to run.
