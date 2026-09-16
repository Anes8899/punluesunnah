import { migrate } from "drizzle-orm/postgres-js/migrator";
import { resolve } from "node:path";
import { loadEnv } from "../env.js";
import { createDb } from "./client.js";

loadEnv();

// Applies ./drizzle/*.sql. Idempotent: drizzle records applied migrations in
// the `__drizzle_migrations` table, so the container can run this on every boot.
export async function runMigrations(): Promise<void> {
  const { db, sql } = createDb();
  try {
    await migrate(db, {
      migrationsFolder: resolve(import.meta.dirname, "../../drizzle"),
    });
  } finally {
    await sql.end();
  }
}

if (process.argv[1] && import.meta.filename === process.argv[1]) {
  runMigrations()
    .then(() => console.log("migrations applied"))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
