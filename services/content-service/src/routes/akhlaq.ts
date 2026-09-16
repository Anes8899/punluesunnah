import type { FastifyPluginAsync } from "fastify";
import { asc, eq } from "drizzle-orm";
import { akhlaqReferences, akhlaqVirtues } from "../db/schema.js";
import { toAkhlaq } from "../mappers.js";
import { akhlaqInput } from "../validation.js";
import { requireApiKey } from "../auth.js";

export const akhlaqRoutes: FastifyPluginAsync = async (app) => {
  /** Library-wide references (not tied to one virtue). */
  app.get("/akhlaq/references", async () => {
    const rows = await app.db
      .select({
        arabic: akhlaqReferences.arabic,
        khmer: akhlaqReferences.khmer,
        source: akhlaqReferences.source,
      })
      .from(akhlaqReferences)
      .orderBy(asc(akhlaqReferences.id));
    return rows;
  });

  app.get("/akhlaq", async () => {
    const rows = await app.db
      .select()
      .from(akhlaqVirtues)
      .orderBy(asc(akhlaqVirtues.sortOrder), asc(akhlaqVirtues.id));
    return rows.map(toAkhlaq);
  });

  app.get<{ Params: { id: string } }>("/akhlaq/:id", async (req, reply) => {
    const [row] = await app.db
      .select()
      .from(akhlaqVirtues)
      .where(eq(akhlaqVirtues.id, req.params.id));
    return row ? toAkhlaq(row) : reply.code(404).send({ error: "Not found" });
  });

  app.post("/akhlaq", { preHandler: requireApiKey }, async (req, reply) => {
    const input = akhlaqInput.parse(req.body);
    const [row] = await app.db.insert(akhlaqVirtues).values(input).returning();
    return reply.code(201).send(toAkhlaq(row));
  });

  app.put<{ Params: { id: string } }>(
    "/akhlaq/:id",
    { preHandler: requireApiKey },
    async (req, reply) => {
      const input = akhlaqInput.parse({ ...(req.body as object), id: req.params.id });
      const [row] = await app.db
        .update(akhlaqVirtues)
        .set(input)
        .where(eq(akhlaqVirtues.id, req.params.id))
        .returning();
      return row ? toAkhlaq(row) : reply.code(404).send({ error: "Not found" });
    },
  );

  app.delete<{ Params: { id: string } }>(
    "/akhlaq/:id",
    { preHandler: requireApiKey },
    async (req, reply) => {
      const rows = await app.db
        .delete(akhlaqVirtues)
        .where(eq(akhlaqVirtues.id, req.params.id))
        .returning();
      return rows.length ? reply.code(204).send() : reply.code(404).send({ error: "Not found" });
    },
  );
};
