import type { FastifyPluginAsync } from "fastify";
import { asc, eq } from "drizzle-orm";
import { khutbahTopics, khutbahs } from "../db/schema.js";
import { toKhutbah, toKhutbahTopic } from "../mappers.js";
import { khutbahInput } from "../validation.js";
import { requireApiKey } from "../auth.js";

export const khutbahRoutes: FastifyPluginAsync = async (app) => {
  app.get("/khutbahs/topics", async () => {
    const rows = await app.db
      .select()
      .from(khutbahTopics)
      .orderBy(asc(khutbahTopics.sortOrder));
    return rows.map(toKhutbahTopic);
  });

  app.get("/khutbahs", async () => {
    const rows = await app.db
      .select()
      .from(khutbahs)
      .orderBy(asc(khutbahs.sortOrder), asc(khutbahs.id));
    return rows.map(toKhutbah);
  });

  app.get<{ Params: { id: string } }>("/khutbahs/:id", async (req, reply) => {
    const [row] = await app.db.select().from(khutbahs).where(eq(khutbahs.id, req.params.id));
    return row ? toKhutbah(row) : reply.code(404).send({ error: "Not found" });
  });

  app.post("/khutbahs", { preHandler: requireApiKey }, async (req, reply) => {
    const input = khutbahInput.parse(req.body);
    const [row] = await app.db.insert(khutbahs).values(input).returning();
    return reply.code(201).send(toKhutbah(row));
  });

  app.put<{ Params: { id: string } }>(
    "/khutbahs/:id",
    { preHandler: requireApiKey },
    async (req, reply) => {
      const input = khutbahInput.parse({ ...(req.body as object), id: req.params.id });
      const [row] = await app.db
        .update(khutbahs)
        .set(input)
        .where(eq(khutbahs.id, req.params.id))
        .returning();
      return row ? toKhutbah(row) : reply.code(404).send({ error: "Not found" });
    },
  );

  app.delete<{ Params: { id: string } }>(
    "/khutbahs/:id",
    { preHandler: requireApiKey },
    async (req, reply) => {
      const rows = await app.db
        .delete(khutbahs)
        .where(eq(khutbahs.id, req.params.id))
        .returning();
      return rows.length ? reply.code(204).send() : reply.code(404).send({ error: "Not found" });
    },
  );
};
