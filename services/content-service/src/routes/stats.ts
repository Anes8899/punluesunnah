import type { FastifyPluginAsync } from "fastify";
import { count } from "drizzle-orm";
import type { PgTable } from "drizzle-orm/pg-core";
import type { ContentStats } from "@punluesunnah/shared-types";
import {
  akhlaqVirtues,
  books,
  duas,
  hadiths,
  khutbahs,
  lessons,
  tazkiyahTopics,
  ustaz,
} from "../db/schema.js";

/** Row counts for the admin overview — one round trip instead of eight lists. */
export const statsRoutes: FastifyPluginAsync = async (app) => {
  app.get("/stats", async (): Promise<ContentStats> => {
    const n = async (table: PgTable) => {
      const [{ value }] = await app.db.select({ value: count() }).from(table);
      return value;
    };
    const [b, l, u, d, h, k, t, a] = await Promise.all([
      n(books),
      n(lessons),
      n(ustaz),
      n(duas),
      n(hadiths),
      n(khutbahs),
      n(tazkiyahTopics),
      n(akhlaqVirtues),
    ]);
    return { books: b, lessons: l, ustaz: u, duas: d, hadiths: h, khutbahs: k, tazkiyah: t, akhlaq: a };
  });
};
