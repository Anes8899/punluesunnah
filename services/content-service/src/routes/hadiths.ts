import type { FastifyPluginAsync } from "fastify";
import { asc, eq } from "drizzle-orm";
import { hadiths } from "../db/schema.js";
import { toHadith } from "../mappers.js";
import { hadithInput, intId } from "../validation.js";
import { requireApiKey } from "../auth.js";

export const hadithRoutes: FastifyPluginAsync = async (app) => {
  app.get("/hadiths", async () => {
    const rows = await app.db.select().from(hadiths).orderBy(asc(hadiths.id));
    return rows.map(toHadith);
  });

  app.get<{ Params: { id: string } }>("/hadiths/:id", async (req, reply) => {
    const id = intId.parse(req.params.id);
    const [row] = await app.db.select().from(hadiths).where(eq(hadiths.id, id));
    return row ? toHadith(row) : reply.code(404).send({ error: "Not found" });
  });

  app.post("/hadiths", { preHandler: requireApiKey }, async (req, reply) => {
    const input = hadithInput.parse(req.body);
    const [row] = await app.db.insert(hadiths).values(input).returning();
    return reply.code(201).send(toHadith(row));
  });

  app.put<{ Params: { id: string } }>(
    "/hadiths/:id",
    { preHandler: requireApiKey },
    async (req, reply) => {
      const id = intId.parse(req.params.id);
      const input = hadithInput.parse(req.body);
      const [row] = await app.db
        .update(hadiths)
        .set(input)
        .where(eq(hadiths.id, id))
        .returning();
      return row ? toHadith(row) : reply.code(404).send({ error: "Not found" });
    },
  );

  app.delete<{ Params: { id: string } }>(
    "/hadiths/:id",
    { preHandler: requireApiKey },
    async (req, reply) => {
      const id = intId.parse(req.params.id);
      const rows = await app.db.delete(hadiths).where(eq(hadiths.id, id)).returning();
      return rows.length ? reply.code(204).send() : reply.code(404).send({ error: "Not found" });
    },
  );
};
