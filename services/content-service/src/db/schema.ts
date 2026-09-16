import {
  boolean,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  serial,
  text,
} from "drizzle-orm/pg-core";
import type {
  AkhlaqReference,
  ContentBlock,
  Subject,
  TazkiyahEntry,
  Video,
} from "@punluesunnah/shared-types";

// Column names stay camelCase-in-TS / snake_case-in-SQL. Nested content that
// the admin edits as a unit (lesson blocks, tazkiyah entries, ustaz videos)
// lives in jsonb rather than child tables: it is always read and written whole.

export const hadiths = pgTable("hadiths", {
  id: serial("id").primaryKey(),
  collection: text("collection").notNull(),
  refNumber: text("ref_number").notNull(),
  book: text("book").notNull(),
  topic: text("topic").notNull(),
  grade: text("grade").notNull(),
  narrator: text("narrator").notNull(),
  arabic: text("arabic").notNull(),
  translation: text("translation").notNull(),
});

export const duaCategories = pgTable("dua_categories", {
  name: text("name").primaryKey(),
  sortOrder: integer("sort_order").notNull(),
});

export const duas = pgTable("duas", {
  id: text("id").primaryKey(),
  category: text("category")
    .notNull()
    .references(() => duaCategories.name),
  title: text("title").notNull(),
  reference: text("reference").notNull(),
  arabic: text("arabic").notNull(),
  khmer: text("khmer").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const khutbahTopics = pgTable("khutbah_topics", {
  id: text("id").primaryKey(),
  labelKm: text("label_km").notNull(),
  sortOrder: integer("sort_order").notNull(),
});

export const khutbahs = pgTable("khutbahs", {
  id: text("id").primaryKey(),
  topic: text("topic")
    .notNull()
    .references(() => khutbahTopics.id),
  topicKm: text("topic_km").notNull(),
  titleKm: text("title_km").notNull(),
  titleAr: text("title_ar").notNull(),
  khatibAr: text("khatib_ar").notNull(),
  mosque: text("mosque").notNull(),
  dateKm: text("date_km").notNull(),
  duration: text("duration").notNull(),
  ayahAr: text("ayah_ar").notNull(),
  body: jsonb("body").$type<string[]>().notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const tazkiyahTopics = pgTable("tazkiyah_topics", {
  id: text("id").primaryKey(),
  kicker: text("kicker").notNull(),
  arabic: text("arabic").notNull(),
  title: text("title").notNull(),
  short: text("short").notNull(),
  group: text("group").$type<"accent" | "accent2">().notNull(),
  entries: jsonb("entries").$type<TazkiyahEntry[]>().notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const akhlaqVirtues = pgTable("akhlaq_virtues", {
  id: text("id").primaryKey(),
  kicker: text("kicker").notNull(),
  arabic: text("arabic").notNull(),
  title: text("title").notNull(),
  short: text("short").notNull(),
  long: text("long").notNull(),
  refs: jsonb("refs").$type<AkhlaqReference[]>().notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

/** General references shown at the end of the akhlaq library. */
export const akhlaqReferences = pgTable("akhlaq_references", {
  id: serial("id").primaryKey(),
  arabic: text("arabic").notNull(),
  khmer: text("khmer").notNull(),
  source: text("source").notNull(),
});

export const books = pgTable("books", {
  key: text("key").primaryKey(),
  id: integer("id").notNull(),
  subject: text("subject").$type<Subject>().notNull(),
  arabicTitle: text("arabic_title").notNull(),
  khmerTitle: text("khmer_title").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const lessons = pgTable(
  "lessons",
  {
    bookKey: text("book_key")
      .notNull()
      .references(() => books.key, { onDelete: "cascade" }),
    id: integer("id").notNull(),
    arabicTitle: text("arabic_title").notNull(),
    khmerTitle: text("khmer_title").notNull(),
    content: jsonb("content").$type<ContentBlock[]>().notNull(),
  },
  (t) => [primaryKey({ columns: [t.bookKey, t.id] })],
);

export const ustaz = pgTable("ustaz", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  image: text("image").notNull(),
  featured: boolean("featured").notNull().default(false),
  specialization: text("specialization").notNull(),
  description: text("description").notNull(),
  videos: jsonb("videos").$type<Video[]>().notNull(),
  facebook: text("facebook"),
  youtube: text("youtube"),
});
