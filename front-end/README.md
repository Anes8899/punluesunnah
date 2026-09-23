# ពន្លឺស៊ុណ្ណះ (Punlue Sunnah)

Islamic content in Khmer: prayer times, Quran, hadith, dua, khutbah, tazkiyah,
akhlaq, and lesson books (aqidah, figh, arabic).

## Architecture

A single Next.js 16 app with no database and no backend services. The content
lives in the repo as TypeScript modules, so most of the site is prerendered at
build time.

```
   browser
      │
      ▼
 ┌─────────────────────────────┐
 │ Next.js  :3000              │
 │                             │
 │  content/   the site's text │  prerendered
 │  app/       routes          │
 │  server/    quran · prayer  │  server-only
 └──────────────┬──────────────┘
                │
        quran.foundation
        (OAuth creds)
```

Prayer times are computed in-process with `adhan`; the Quran text is fetched
from quran.foundation and cached for a day.

| Path | Role |
| --- | --- |
| `app/` | Routes, pages and components. `app/api/prayer-times` serves the prayer panel, which needs the browser's location. |
| `content/` | The site's content. `index.ts` has the getters; the other files hold the data. |
| `lib/` | Client-side helpers (formatting, mushaf line layout). |
| `server/` | Server-only code: the quran.foundation client and prayer-time calculation. `server-only` keeps it off the client. |
| `types/` | Shared TypeScript shapes. Types only. |

## Editing content

Edit the file in `content/` and rebuild — that is the whole flow. Each file is
typed against `types/`, so a malformed entry fails `npm run typecheck` rather
than rendering wrong.

| File | Holds |
| --- | --- |
| `hadith.ts` `dua.ts` `khutbah.ts` `tazkiyah.ts` `akhlaq.ts` | the libraries |
| `aqidah.ts` `figh.ts` `arabic.ts` | lesson books, one array of books each |
| `ustaz.ts` | the teachers and their videos |
| `index.ts` | the getters the pages call |

Books get their `key` and `subject` from the file they live in (see
`content/book-source.ts`), so a book only declares `id`, its titles and its
lessons.

## Running locally

Prerequisites: Node 22+.

```bash
cp .env.example .env        # fill in QURAN_CLIENT_ID / QURAN_CLIENT_SECRET
npm install
npm run dev                 # http://localhost:3000
```

Next reads the root `.env` natively. The credentials are only needed for the
Quran pages; the rest of the site runs without them.

| Command | What it does |
| --- | --- |
| `npm run dev` / `build` / `start` | the app |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | eslint |

## Notes

- This Next.js version differs from older releases; see `AGENTS.md` before
  writing code.
