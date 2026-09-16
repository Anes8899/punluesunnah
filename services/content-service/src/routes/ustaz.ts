import type { FastifyPluginAsync } from "fastify";
import { asc, eq } from "drizzle-orm";
import { ustaz } from "../db/schema.js";
import { toUstaz } from "../mappers.js";
import { intId, ustazInput } from "../validation.js";
import { requireApiKey } from "../auth.js";

const flatten = ({ social, ...rest }: ReturnType<typeof ustazInput.parse>) => ({
  ...rest,
  facebook: social.facebook,
  youtube: social.youtube,
});

export const ustazRoutes: FastifyPluginAsync = async (app) => {
  app.get("/ustaz", async () => {
    const rows = await app.db.select().from(ustaz).orderBy(asc(ustaz.id));
    return rows.map(toUstaz);
  });

  app.get<{ Params: { id: string } }>("/ustaz/:id", async (req, reply) => {
    const id = intId.parse(req.params.id);
    const [row] = await app.db.select().from(ustaz).where(eq(ustaz.id, id));
    return row ? toUstaz(row) : reply.code(404).send({ error: "Not found" });
  });

  app.post("/ustaz", { preHandler: requireApiKey }, async (req, reply) => {
    const input = ustazInput.parse(req.body);
    const [row] = await app.db.insert(ustaz).values(flatten(input)).returning();
    return reply.code(201).send(toUstaz(row));
  });

  app.put<{ Params: { id: string } }>(
    "/ustaz/:id",
    { preHandler: requireApiKey },
    async (req, reply) => {
      const id = intId.parse(req.params.id);
      const input = ustazInput.parse(req.body);
      const [row] = await app.db
        .update(ustaz)
        .set(flatten(input))
        .where(eq(ustaz.id, id))
        .returning();
      return row ? toUstaz(row) : reply.code(404).send({ error: "Not found" });
    },
  );

  app.delete<{ Params: { id: string } }>(
    "/ustaz/:id",
    { preHandler: requireApiKey },
    async (req, reply) => {
      const id = intId.parse(req.params.id);
      const rows = await app.db.delete(ustaz).where(eq(ustaz.id, id)).returning();
      return rows.length ? reply.code(204).send() : reply.code(404).send({ error: "Not found" });
    },
  );
};
