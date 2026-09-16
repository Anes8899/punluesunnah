import { count } from "drizzle-orm";
import type { PgTable } from "drizzle-orm/pg-core";
import { loadEnv } from "../src/env.js";
import { createDb } from "../src/db/client.js";
import { runMigrations } from "../src/db/migrate.js";
import * as t from "../src/db/schema.js";
import { HADITHS } from "./data/hadith.js";
import { DUAS, DUA_CATEGORIES } from "./data/dua.js";
import { KHUTBAHS, KHUTBAH_TOPICS } from "./data/khutbah.js";
import { TAZKIYAH_TOPICS } from "./data/tazkiyah.js";
import { AKHLAQ_REFERENCES, AKHLAQ_VIRTUES } from "./data/akhlaq.js";
import { AQIDAH_BOOKS } from "./data/aqidah.js";
import { FIGH_BOOKS } from "./data/figh.js";
import { ARABIC_BOOKS } from "./data/arabic.js";
import ustazJson from "./data/ustaz.json" with { type: "json" };

/**
 * Loads the content that used to be hard-coded in the web app. Skips any table
 * that already has rows, so it is safe to run on every deploy; pass `--force`
 * to wipe and reload everything (useful after editing ./data).
 */
loadEnv();
await runMigrations();

const force = process.argv.includes("--force");
const { db, sql } = createDb();

const isEmpty = async (table: PgTable) => {
  const [{ value }] = await db.select({ value: count() }).from(table);
  return value === 0;
};

await db.transaction(async (tx) => {
  if (force) {
    await tx.delete(t.lessons);
    await tx.delete(t.books);
    await tx.delete(t.duas);
    await tx.delete(t.duaCategories);
    await tx.delete(t.khutbahs);
    await tx.delete(t.khutbahTopics);
    await tx.delete(t.hadiths);
    await tx.delete(t.tazkiyahTopics);
    await tx.delete(t.akhlaqVirtues);
    await tx.delete(t.akhlaqReferences);
    await tx.delete(t.ustaz);
  }

  if (await isEmpty(t.hadiths)) {
    await tx.insert(t.hadiths).values(HADITHS);
    // serial sequence must move past the explicit ids we just inserted
    await tx.execute(
      `select setval(pg_get_serial_sequence('hadiths','id'), (select max(id) from hadiths))`,
    );
    console.log(`hadiths: ${HADITHS.length}`);
  }

  if (await isEmpty(t.duaCategories)) {
    await tx
      .insert(t.duaCategories)
      .values(DUA_CATEGORIES.map((name, i) => ({ name, sortOrder: i })));
    await tx.insert(t.duas).values(DUAS.map((d, i) => ({ ...d, sortOrder: i })));
    console.log(`duas: ${DUAS.length} in ${DUA_CATEGORIES.length} categories`);
  }

  if (await isEmpty(t.khutbahTopics)) {
    await tx
      .insert(t.khutbahTopics)
      .values(KHUTBAH_TOPICS.map((k, i) => ({ ...k, sortOrder: i })));
    await tx.insert(t.khutbahs).values(KHUTBAHS.map((k, i) => ({ ...k, sortOrder: i })));
    console.log(`khutbahs: ${KHUTBAHS.length}`);
  }

  if (await isEmpty(t.tazkiyahTopics)) {
    await tx
      .insert(t.tazkiyahTopics)
      .values(TAZKIYAH_TOPICS.map((x, i) => ({ ...x, sortOrder: i })));
    console.log(`tazkiyah: ${TAZKIYAH_TOPICS.length}`);
  }

  if (await isEmpty(t.akhlaqVirtues)) {
    await tx
      .insert(t.akhlaqVirtues)
      .values(AKHLAQ_VIRTUES.map((x, i) => ({ ...x, sortOrder: i })));
    await tx.insert(t.akhlaqReferences).values(AKHLAQ_REFERENCES);
    console.log(`akhlaq: ${AKHLAQ_VIRTUES.length}`);
  }

  if (await isEmpty(t.books)) {
    const sources = [
      ["aqidah", AQIDAH_BOOKS],
      ["figh", FIGH_BOOKS],
      ["arabic", ARABIC_BOOKS],
    ] as const;
    let lessonCount = 0;
    for (const [subject, list] of sources) {
      for (const [i, book] of list.entries()) {
        const key = `${subject}-${book.id}`;
        await tx.insert(t.books).values({
          key,
          id: book.id,
          subject,
          arabicTitle: book.arabic_title,
          khmerTitle: book.khmer_title,
          sortOrder: i,
        });
        await tx.insert(t.lessons).values(
          book.lessons.map((l) => ({
            bookKey: key,
            id: l.id,
            arabicTitle: l.arabic_title,
            khmerTitle: l.khmer_title,
            content: l.content,
          })),
        );
        lessonCount += book.lessons.length;
      }
    }
    console.log(`books: ${sources.reduce((n, [, l]) => n + l.length, 0)}, lessons: ${lessonCount}`);
  }

  if (await isEmpty(t.ustaz)) {
    await tx.insert(t.ustaz).values(
      ustazJson.map(({ social, videos, ...u }) => ({
        ...u,
        videos: videos as (typeof t.ustaz)["$inferInsert"]["videos"],
        facebook: social.facebook ?? null,
        youtube: social.youtube ?? null,
      })),
    );
    await tx.execute(
      `select setval(pg_get_serial_sequence('ustaz','id'), (select max(id) from ustaz))`,
    );
    console.log(`ustaz: ${ustazJson.length}`);
  }
});

await sql.end();
console.log("seed complete");
