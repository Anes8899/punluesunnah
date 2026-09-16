import type { FastifyReply, FastifyRequest } from "fastify";
import { requireEnv } from "./env.js";

/**
 * Write endpoints are only ever called by the web app's admin Server Actions,
 * which send the shared secret. Reads are open: the site is public content.
 */
export async function requireApiKey(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<FastifyReply | void> {
  const expected = requireEnv("CONTENT_API_KEY");
  if (request.headers["x-api-key"] !== expected) {
    return reply.code(401).send({ error: "Unauthorized" });
  }
}
