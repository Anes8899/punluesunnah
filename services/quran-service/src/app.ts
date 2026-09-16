import Fastify from "fastify";
import cors from "@fastify/cors";
import { getChapters, getVerses } from "./quranClient.js";

export function buildApp() {
  const app = Fastify({ logger: true });
  app.register(cors, { origin: process.env.CORS_ORIGIN ?? false });

  app.get("/health", async () => ({ status: "ok", service: "quran-service" }));

  app.get("/chapters", async () => getChapters());

  app.get<{ Params: { id: string } }>("/chapters/:id", async (req, reply) => {
    const id = Number(req.params.id);
    const chapter = (await getChapters()).find((c) => c.id === id);
    return chapter ?? reply.code(404).send({ error: "Not found" });
  });

  app.get<{ Params: { id: string } }>("/chapters/:id/verses", async (req, reply) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1 || id > 114) {
      return reply.code(404).send({ error: "Not found" });
    }
    return getVerses(id);
  });

  return app;
}
