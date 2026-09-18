# ពន្លឺស៊ុណ្ណះ (Punlue Sunnah)

Islamic content in Khmer: prayer times, Quran, hadith, dua, khutbah, tazkiyah,
akhlaq, and lesson books (aqidah, figh, arabic).

## Architecture

```
   browser ─────────────────────────┐
                                    ▼
                     ┌──────────────────┐
                     │ apps/web  :3000  │
                     │ public site      │
                     └──┬──────┬──────┬─┘
                        │      │      │  server-side fetch only
          ┌─────────────▼┐  ┌──▼───────┐ ┌▼──────────────┐
          │prayer-service│  │quran-svc │ │content-service │
          │ :4003        │  │ :4002    │ │ :4001          │
          │ Fastify+adhan│  │ Fastify  │ │ Fastify+Drizzle│
          └──────────────┘  └────┬─────┘ └───────┬────────┘
                                 │               │
                        quran.foundation    ┌────▼───────┐
                        (OAuth creds)       │ PostgreSQL │
                                            └────────────┘
```

| Package | Role |
| --- | --- |
| `apps/web` | Next.js 16 public site. Read-only: talks to the services from Server Components and Route Handlers; service URLs never reach the browser. Exposes `POST /api/revalidate` to expire its cache after a content change. |
| `apps/admin` | Next.js 16 app on :3001. Empty shell for now. |
| `services/content-service` | All editable content (hadith, dua, khutbah, tazkiyah, akhlaq, books/lessons, ustaz). REST over Postgres via Drizzle; writes require `x-api-key`. Runs its migrations on boot. |
| `services/quran-service` | Proxy for quran.foundation. Owns the OAuth credentials and caches the token, chapter list and verses in memory. |
| `services/prayer-service` | Prayer times (adhan, Shafi, Cambodia adjustments) and Hijri dates. Stateless. |
| `packages/shared-types` | TypeScript contracts shared by the apps and services. Types only. |
| `packages/api-client` | Server-only fetch clients for the three services, used by the web app (via `transpilePackages`). |

Each service exposes `GET /health`.

### Caching

The web app fetches through the Next.js data cache with a tag per resource
(`hadiths`, `books`, …), so normal traffic never touches the services. After
writing to content-service, call `POST $WEB_URL/api/revalidate` with the
`x-revalidate-secret: $REVALIDATE_SECRET` header and a `{ "tags": [...] }`
body to expire those tags (`revalidateTag(tag, { expire: 0 })`); otherwise the
cache expires on its own within the hour.

## Running locally

Prerequisites: Node 22+, Docker.

```bash
cp .env.example .env        # fill in QURAN_CLIENT_ID / QURAN_CLIENT_SECRET
npm install
npm run db:up               # Postgres in Docker (host port POSTGRES_PORT)
npm run db:seed             # migrate + load the initial content (idempotent)
npm run dev                 # web :3000, admin :3001 + the three services, with hot reload
```

One `.env` at the repo root feeds everything: the services walk up from their
folder to find it, and the web app's scripts inject it with `dotenv -e`.

Useful scripts:

| Command | What it does |
| --- | --- |
| `npm run dev:web` / `dev:admin` / `dev:content` / `dev:quran` / `dev:prayer` | run one process |
| `npm run typecheck` | `tsc --noEmit` in every workspace |
| `npm run build` | production build of every workspace |
| `npm run db:seed -- --force` | wipe and reload the seed content from `services/content-service/seed/data` |
| `npm run db:generate -w services/content-service` | create a migration after editing `src/db/schema.ts` |

## Running with Docker Compose

```bash
docker compose up --build
```

Brings up Postgres, the three services, a one-shot `content-seed` job, the web
app on http://localhost:3000 and the admin app on http://localhost:3001. Only
those two apps and Postgres are published on the host; the services talk over
the compose network.

## Content service API

| Method | Path | Notes |
| --- | --- | --- |
| GET | `/hadiths`, `/hadiths/:id` | |
| GET | `/duas?category=`, `/duas/:id`, `/duas/categories` | |
| GET | `/khutbahs`, `/khutbahs/:id`, `/khutbahs/topics` | |
| GET | `/tazkiyah`, `/tazkiyah/:id` | |
| GET | `/akhlaq`, `/akhlaq/:id`, `/akhlaq/references` | |
| GET | `/books?subject=`, `/books/:key`, `/books/:key/lessons/:id` | key = `${subject}-${id}` |
| GET | `/ustaz`, `/ustaz/:id` | |
| GET | `/stats` | row counts per resource |
| POST/PUT/DELETE | same resources | require header `x-api-key: $CONTENT_API_KEY` |

## Notes

- This Next.js version differs from older releases; see `AGENTS.md` before
  writing code in `apps/web`.
