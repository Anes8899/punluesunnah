import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { requireEnv } from "../env.js";
import * as schema from "./schema.js";

export function createDb() {
  // onnotice: drizzle's migrator emits "already exists, skipping" notices on
  // every boot, which postgres.js would otherwise print as errors.
  const sql = postgres(requireEnv("DATABASE_URL"), { max: 10, onnotice: () => {} });
  return { db: drizzle(sql, { schema }), sql };
}

export type Db = ReturnType<typeof createDb>["db"];
