import type { FastifyPluginAsync } from "fastify";
import { asc, eq } from "drizzle-orm";
import { duaCategories, duas } from "../db/schema.js";
import { toDua } from "../mappers.js";
import { duaInput } from "../validation.js";
import { requireApiKey } from "../auth.js";

export const duaRoutes: FastifyPluginAsync = async (app) => {
  /** Category names in display order. */
  app.get("/duas/categories", async () => {
    const rows = await app.db
      .select({ name: duaCategories.name })
      .from(duaCategories)
      .orderBy(asc(duaCategories.sortOrder));
    return rows.map((r) => r.name);
  });

  app.get<{ Querystring: { category?: string } }>("/duas", async (req) => {
    const q = app.db.select().from(duas).orderBy(asc(duas.sortOrder), asc(duas.id));
    const rows = req.query.category
      ? await q.where(eq(duas.category, req.query.category))
      : await q;
    return rows.map(toDua);
  });

  app.get<{ Params: { id: string } }>("/duas/:id", async (req, reply) => {
    const [row] = await app.db.select().from(duas).where(eq(duas.id, req.params.id));
    return row ? toDua(row) : reply.code(404).send({ error: "Not found" });
  });

  app.post("/duas", { preHandler: requireApiKey }, async (req, reply) => {
    const input = duaInput.parse(req.body);
    const [row] = await app.db.insert(duas).values(input).returning();
    return reply.code(201).send(toDua(row));
  });

  app.put<{ Params: { id: string } }>(
    "/duas/:id",
    { preHandler: requireApiKey },
    async (req, reply) => {
      const input = duaInput.parse({ ...(req.body as object), id: req.params.id });
      const [row] = await app.db
        .update(duas)
        .set(input)
        .where(eq(duas.id, req.params.id))
        .returning();
      return row ? toDua(row) : reply.code(404).send({ error: "Not found" });
    },
  );

  app.delete<{ Params: { id: string } }>(
    "/duas/:id",
    { preHandler: requireApiKey },
    async (req, reply) => {
      const rows = await app.db.delete(duas).where(eq(duas.id, req.params.id)).returning();
      return rows.length ? reply.code(204).send() : reply.code(404).send({ error: "Not found" });
    },
  );
};
