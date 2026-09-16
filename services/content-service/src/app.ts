import Fastify from "fastify";
import cors from "@fastify/cors";
import { ZodError } from "zod";
import type { Db } from "./db/client.js";
import { hadithRoutes } from "./routes/hadiths.js";
import { duaRoutes } from "./routes/duas.js";
import { khutbahRoutes } from "./routes/khutbahs.js";
import { tazkiyahRoutes } from "./routes/tazkiyah.js";
import { akhlaqRoutes } from "./routes/akhlaq.js";
import { bookRoutes } from "./routes/books.js";
import { ustazRoutes } from "./routes/ustaz.js";
import { statsRoutes } from "./routes/stats.js";

declare module "fastify" {
  interface FastifyInstance {
    db: Db;
  }
}

export function buildApp(db: Db) {
  const app = Fastify({ logger: true });
  app.decorate("db", db);
  app.register(cors, { origin: process.env.CORS_ORIGIN ?? false });

  app.setErrorHandler((err, _req, reply) => {
    if (err instanceof ZodError) {
      return reply.code(400).send({ error: "Invalid request", issues: err.issues });
    }
    app.log.error(err);
    const { statusCode, message } = err as { statusCode?: number; message?: string };
    const status = statusCode && statusCode >= 400 ? statusCode : 500;
    return reply.code(status).send({ error: status === 500 ? "Internal error" : message });
  });

  app.get("/health", async () => ({ status: "ok", service: "content-service" }));

  app.register(hadithRoutes);
  app.register(duaRoutes);
  app.register(khutbahRoutes);
  app.register(tazkiyahRoutes);
  app.register(akhlaqRoutes);
  app.register(bookRoutes);
  app.register(ustazRoutes);
  app.register(statsRoutes);

  return app;
}
