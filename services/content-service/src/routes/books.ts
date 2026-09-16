import type { FastifyPluginAsync } from "fastify";
import { and, asc, count, eq, max, sql } from "drizzle-orm";
import { books, lessons } from "../db/schema.js";
import { toBook, toBookSummary, toLesson } from "../mappers.js";
import { bookInput, intId, lessonInput, subject } from "../validation.js";
import { requireApiKey } from "../auth.js";

export const bookKey = (s: string, id: number) => `${s}-${id}`;

export const bookRoutes: FastifyPluginAsync = async (app) => {
  // List endpoints return summaries: lesson content is large and the lists
  // only need titles and counts.
  app.get<{ Querystring: { subject?: string } }>("/books", async (req) => {
    const where = req.query.subject
      ? eq(books.subject, subject.parse(req.query.subject))
      : undefined;
    const rows = await app.db
      .select({ book: books, lessonCount: count(lessons.id) })
      .from(books)
      .leftJoin(lessons, eq(lessons.bookKey, books.key))
      .where(where)
      .groupBy(books.key)
      .orderBy(asc(books.subject), asc(books.sortOrder), asc(books.id));
    return rows.map((r) => toBookSummary(r.book, r.lessonCount));
  });

  app.get<{ Params: { key: string } }>("/books/:key", async (req, reply) => {
    const [book] = await app.db.select().from(books).where(eq(books.key, req.params.key));
    if (!book) return reply.code(404).send({ error: "Not found" });
    const lessonRows = await app.db
      .select()
      .from(lessons)
      .where(eq(lessons.bookKey, book.key))
      .orderBy(asc(lessons.id));
    return toBook(book, lessonRows);
  });

  app.get<{ Params: { key: string; lessonId: string } }>(
    "/books/:key/lessons/:lessonId",
    async (req, reply) => {
      const lessonId = intId.parse(req.params.lessonId);
      const [row] = await app.db
        .select()
        .from(lessons)
        .where(and(eq(lessons.bookKey, req.params.key), eq(lessons.id, lessonId)));
      return row ? toLesson(row) : reply.code(404).send({ error: "Not found" });
    },
  );

  app.post("/books", { preHandler: requireApiKey }, async (req, reply) => {
    const input = bookInput.parse(req.body);
    const row = await app.db.transaction(async (tx) => {
      const [{ nextId }] = await tx
        .select({ nextId: sql<number>`coalesce(${max(books.id)}, 0) + 1` })
        .from(books)
        .where(eq(books.subject, input.subject));
      const [created] = await tx
        .insert(books)
        .values({
          key: bookKey(input.subject, nextId),
          id: nextId,
          subject: input.subject,
          arabicTitle: input.arabic_title,
          khmerTitle: input.khmer_title,
          sortOrder: nextId,
        })
        .returning();
      return created;
    });
    return reply.code(201).send(toBook(row, []));
  });

  app.put<{ Params: { key: string } }>(
    "/books/:key",
    { preHandler: requireApiKey },
    async (req, reply) => {
      const input = bookInput.omit({ subject: true }).parse(req.body);
      const [row] = await app.db
        .update(books)
        .set({ arabicTitle: input.arabic_title, khmerTitle: input.khmer_title })
        .where(eq(books.key, req.params.key))
        .returning();
      if (!row) return reply.code(404).send({ error: "Not found" });
      const lessonRows = await app.db
        .select()
        .from(lessons)
        .where(eq(lessons.bookKey, row.key))
        .orderBy(asc(lessons.id));
      return toBook(row, lessonRows);
    },
  );

  app.post<{ Params: { key: string } }>(
    "/books/:key/lessons",
    { preHandler: requireApiKey },
    async (req, reply) => {
      const input = lessonInput.parse(req.body);
      const [book] = await app.db.select().from(books).where(eq(books.key, req.params.key));
      if (!book) return reply.code(404).send({ error: "Not found" });
      const row = await app.db.transaction(async (tx) => {
        const [{ nextId }] = await tx
          .select({ nextId: sql<number>`coalesce(${max(lessons.id)}, 0) + 1` })
          .from(lessons)
          .where(eq(lessons.bookKey, book.key));
        const [created] = await tx
          .insert(lessons)
          .values({
            bookKey: book.key,
            id: nextId,
            arabicTitle: input.arabic_title,
            khmerTitle: input.khmer_title,
            content: input.content,
          })
          .returning();
        return created;
      });
      return reply.code(201).send(toLesson(row));
    },
  );

  app.put<{ Params: { key: string; lessonId: string } }>(
    "/books/:key/lessons/:lessonId",
    { preHandler: requireApiKey },
    async (req, reply) => {
      const lessonId = intId.parse(req.params.lessonId);
      const input = lessonInput.parse(req.body);
      const [row] = await app.db
        .update(lessons)
        .set({
          arabicTitle: input.arabic_title,
          khmerTitle: input.khmer_title,
          content: input.content,
        })
        .where(and(eq(lessons.bookKey, req.params.key), eq(lessons.id, lessonId)))
        .returning();
      return row ? toLesson(row) : reply.code(404).send({ error: "Not found" });
    },
  );

  app.delete<{ Params: { key: string; lessonId: string } }>(
    "/books/:key/lessons/:lessonId",
    { preHandler: requireApiKey },
    async (req, reply) => {
      const lessonId = intId.parse(req.params.lessonId);
      const rows = await app.db
        .delete(lessons)
        .where(and(eq(lessons.bookKey, req.params.key), eq(lessons.id, lessonId)))
        .returning();
      return rows.length ? reply.code(204).send() : reply.code(404).send({ error: "Not found" });
    },
  );
};
