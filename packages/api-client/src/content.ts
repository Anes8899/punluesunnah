import "server-only";
import type {
  AkhlaqReference,
  AkhlaqVirtue,
  Book,
  BookSummary,
  ContentStats,
  Dua,
  Hadith,
  HadithInput,
  Khutbah,
  KhutbahTopic,
  Lesson,
  LessonInput,
  Subject,
  TazkiyahTopic,
  Ustaz,
  UstazInput,
} from "@punluesunnah/shared-types";
import { getJson, mustGetJson, sendJson, serviceUrl } from "./client";

// Reads go through the Next.js data cache under a tag per resource; the admin
// Server Actions revalidate that tag after each write, so public pages pick up
// edits on their next request while ordinary traffic never hits the service.

const REVALIDATE = 60 * 60;

const url = (path: string) => `${serviceUrl("CONTENT")}${path}`;
const read = <T>(path: string, tag: string) =>
  mustGetJson<T>(url(path), { revalidate: REVALIDATE, tags: [tag] });
const readOptional = <T>(path: string, tag: string) =>
  getJson<T>(url(path), { revalidate: REVALIDATE, tags: [tag] });

const writeHeaders = () => {
  const key = process.env.CONTENT_API_KEY;
  if (!key) throw new Error("Missing CONTENT_API_KEY environment variable");
  return { "x-api-key": key };
};
const write = <T>(method: "POST" | "PUT" | "DELETE", path: string, body?: unknown) =>
  sendJson<T>(url(path), method, body, writeHeaders());

export const TAGS = {
  hadiths: "hadiths",
  duas: "duas",
  khutbahs: "khutbahs",
  tazkiyah: "tazkiyah",
  akhlaq: "akhlaq",
  books: "books",
  ustaz: "ustaz",
} as const;

// ── hadith ─────────────────────────────────────────────────────────────────
export const listHadiths = () => read<Hadith[]>("/hadiths", TAGS.hadiths);
export const getHadith = (id: number) => readOptional<Hadith>(`/hadiths/${id}`, TAGS.hadiths);
export const createHadith = (input: HadithInput) => write<Hadith>("POST", "/hadiths", input);
export const updateHadith = (id: number, input: HadithInput) =>
  write<Hadith>("PUT", `/hadiths/${id}`, input);
export const deleteHadith = (id: number) => write<void>("DELETE", `/hadiths/${id}`);

// ── dua ────────────────────────────────────────────────────────────────────
export const listDuaCategories = () => read<string[]>("/duas/categories", TAGS.duas);
export const listDuas = (category?: string) =>
  read<Dua[]>(
    category ? `/duas?category=${encodeURIComponent(category)}` : "/duas",
    TAGS.duas,
  );
export const getDua = (id: string) =>
  readOptional<Dua>(`/duas/${encodeURIComponent(id)}`, TAGS.duas);
export const createDua = (input: Dua) => write<Dua>("POST", "/duas", input);
export const updateDua = (id: string, input: Omit<Dua, "id">) =>
  write<Dua>("PUT", `/duas/${encodeURIComponent(id)}`, input);
export const deleteDua = (id: string) => write<void>("DELETE", `/duas/${encodeURIComponent(id)}`);

// ── khutbah ────────────────────────────────────────────────────────────────
export const listKhutbahTopics = () => read<KhutbahTopic[]>("/khutbahs/topics", TAGS.khutbahs);
export const listKhutbahs = () => read<Khutbah[]>("/khutbahs", TAGS.khutbahs);
export const getKhutbah = (id: string) =>
  readOptional<Khutbah>(`/khutbahs/${encodeURIComponent(id)}`, TAGS.khutbahs);
export const createKhutbah = (input: Khutbah) => write<Khutbah>("POST", "/khutbahs", input);
export const updateKhutbah = (id: string, input: Omit<Khutbah, "id">) =>
  write<Khutbah>("PUT", `/khutbahs/${encodeURIComponent(id)}`, input);
export const deleteKhutbah = (id: string) =>
  write<void>("DELETE", `/khutbahs/${encodeURIComponent(id)}`);

// ── tazkiyah ───────────────────────────────────────────────────────────────
export const listTazkiyah = () => read<TazkiyahTopic[]>("/tazkiyah", TAGS.tazkiyah);
export const getTazkiyah = (id: string) =>
  readOptional<TazkiyahTopic>(`/tazkiyah/${encodeURIComponent(id)}`, TAGS.tazkiyah);
export const createTazkiyah = (input: TazkiyahTopic) =>
  write<TazkiyahTopic>("POST", "/tazkiyah", input);
export const updateTazkiyah = (id: string, input: Omit<TazkiyahTopic, "id">) =>
  write<TazkiyahTopic>("PUT", `/tazkiyah/${encodeURIComponent(id)}`, input);
export const deleteTazkiyah = (id: string) =>
  write<void>("DELETE", `/tazkiyah/${encodeURIComponent(id)}`);

// ── akhlaq ─────────────────────────────────────────────────────────────────
export const listAkhlaq = () => read<AkhlaqVirtue[]>("/akhlaq", TAGS.akhlaq);
export const listAkhlaqReferences = () =>
  read<AkhlaqReference[]>("/akhlaq/references", TAGS.akhlaq);
export const getAkhlaq = (id: string) =>
  readOptional<AkhlaqVirtue>(`/akhlaq/${encodeURIComponent(id)}`, TAGS.akhlaq);
export const createAkhlaq = (input: AkhlaqVirtue) => write<AkhlaqVirtue>("POST", "/akhlaq", input);
export const updateAkhlaq = (id: string, input: Omit<AkhlaqVirtue, "id">) =>
  write<AkhlaqVirtue>("PUT", `/akhlaq/${encodeURIComponent(id)}`, input);
export const deleteAkhlaq = (id: string) =>
  write<void>("DELETE", `/akhlaq/${encodeURIComponent(id)}`);

// ── books & lessons ────────────────────────────────────────────────────────
export const bookKey = (subject: Subject, id: number): string => `${subject}-${id}`;

export const listBooks = (subject?: Subject) =>
  read<BookSummary[]>(subject ? `/books?subject=${subject}` : "/books", TAGS.books);
export const getBook = (key: string) => readOptional<Book>(`/books/${key}`, TAGS.books);
export const getLesson = (key: string, lessonId: number) =>
  readOptional<Lesson>(`/books/${key}/lessons/${lessonId}`, TAGS.books);
export const createBook = (input: Pick<Book, "subject" | "arabic_title" | "khmer_title">) =>
  write<Book>("POST", "/books", input);
export const updateBook = (key: string, input: Pick<Book, "arabic_title" | "khmer_title">) =>
  write<Book>("PUT", `/books/${key}`, input);
export const createLesson = (key: string, input: LessonInput) =>
  write<Lesson>("POST", `/books/${key}/lessons`, input);
export const updateLesson = (key: string, lessonId: number, input: LessonInput) =>
  write<Lesson>("PUT", `/books/${key}/lessons/${lessonId}`, input);
export const deleteLesson = (key: string, lessonId: number) =>
  write<void>("DELETE", `/books/${key}/lessons/${lessonId}`);

// ── ustaz ──────────────────────────────────────────────────────────────────
export const listUstaz = () => read<Ustaz[]>("/ustaz", TAGS.ustaz);
export const getUstaz = (id: number) => readOptional<Ustaz>(`/ustaz/${id}`, TAGS.ustaz);
export const createUstaz = (input: UstazInput) => write<Ustaz>("POST", "/ustaz", input);
export const updateUstaz = (id: number, input: UstazInput) =>
  write<Ustaz>("PUT", `/ustaz/${id}`, input);
export const deleteUstaz = (id: number) => write<void>("DELETE", `/ustaz/${id}`);

// ── admin overview ─────────────────────────────────────────────────────────
export const getStats = () =>
  mustGetJson<ContentStats>(url("/stats"), {
    revalidate: REVALIDATE,
    tags: Object.values(TAGS),
  });
