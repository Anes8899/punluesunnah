import { loadEnv } from "./env.js";
import { createDb } from "./db/client.js";
import { runMigrations } from "./db/migrate.js";
import { buildApp } from "./app.js";

loadEnv();

// Migrations run on boot so `docker compose up` brings up a ready schema; the
// initial content is inserted separately by `npm run db:seed` (idempotent).
if (process.env.RUN_MIGRATIONS !== "false") {
  await runMigrations();
}

const { db } = createDb();
const app = buildApp(db);

const port = Number(process.env.PORT ?? 4001);
await app.listen({ port, host: "0.0.0.0" });
