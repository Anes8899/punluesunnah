# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

# Layout

One Next.js app, no database, no containers.

- `app/` — routes and components. `lib/` — client-side helpers.
- `content/` — the site's content as typed TS modules. `content/index.ts` exposes the getters (`listHadiths`, `getBook`, …); the sibling files hold the data. Editing a file here is the whole publishing flow.
- `server/` — the only server-side code: `quran.ts` (quran.foundation, holds the OAuth credentials) and `prayer.ts` (adhan). Guarded by `server-only`; never import it from a Client Component.
- `types/` — shared shapes. Types only; keep it free of runtime code.

Everything imports through the `@/` alias (`@/content`, `@/server/quran`, `@/types`).

# Rendering

The content pages are statically prerendered — they read from `content/`, so there is nothing to defer to request time. Do not add `connection()` or other dynamic APIs to them without a reason; it would opt them out of prerendering.

The Quran routes stay dynamic on purpose: they call quran.foundation, and the build should not depend on that API or its credentials. Those calls are wrapped in `unstable_cache` for a day. Next 16 recommends `use cache` instead, but that needs `cacheComponents: true`, which changes rendering for every route — migrate the whole app in one deliberate change, not one call site at a time.

`.env` at the repo root holds only the quran.foundation credentials; Next loads it natively. See `README.md`.
