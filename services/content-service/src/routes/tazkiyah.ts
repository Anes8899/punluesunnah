import type { FastifyPluginAsync } from "fastify";
import { asc, eq } from "drizzle-orm";
import { tazkiyahTopics } from "../db/schema.js";
import { toTazkiyah } from "../mappers.js";
import { tazkiyahInput } from "../validation.js";
import { requireApiKey } from "../auth.js";

export const tazkiyahRoutes: FastifyPluginAsync = async (app) => {
  app.get("/tazkiyah", async () => {
    const rows = await app.db
      .select()
      .from(tazkiyahTopics)
      .orderBy(asc(tazkiyahTopics.sortOrder), asc(tazkiyahTopics.id));
    return rows.map(toTazkiyah);
  });

  app.get<{ Params: { id: string } }>("/tazkiyah/:id", async (req, reply) => {
    const [row] = await app.db
      .select()
      .from(tazkiyahTopics)
      .where(eq(tazkiyahTopics.id, req.params.id));
    return row ? toTazkiyah(row) : reply.code(404).send({ error: "Not found" });
  });

  app.post("/tazkiyah", { preHandler: requireApiKey }, async (req, reply) => {
    const input = tazkiyahInput.parse(req.body);
    const [row] = await app.db.insert(tazkiyahTopics).values(input).returning();
    return reply.code(201).send(toTazkiyah(row));
  });

  app.put<{ Params: { id: string } }>(
    "/tazkiyah/:id",
    { preHandler: requireApiKey },
    async (req, reply) => {
      const input = tazkiyahInput.parse({ ...(req.body as object), id: req.params.id });
      const [row] = await app.db
        .update(tazkiyahTopics)
        .set(input)
        .where(eq(tazkiyahTopics.id, req.params.id))
        .returning();
      return row ? toTazkiyah(row) : reply.code(404).send({ error: "Not found" });
    },
  );

  app.delete<{ Params: { id: string } }>(
    "/tazkiyah/:id",
    { preHandler: requireApiKey },
    async (req, reply) => {
      const rows = await app.db
        .delete(tazkiyahTopics)
        .where(eq(tazkiyahTopics.id, req.params.id))
        .returning();
      return rows.length ? reply.code(204).send() : reply.code(404).send({ error: "Not found" });
    },
  );
};
