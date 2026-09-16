import { z } from "zod";

// Request bodies for write endpoints. Kept next to each other so the shapes
// visibly mirror shared-types; a drift here is a contract bug.

export const hadithInput = z.object({
  collection: z.string().min(1),
  refNumber: z.string().min(1),
  book: z.string().min(1),
  topic: z.string().min(1),
  grade: z.string().min(1),
  narrator: z.string().min(1),
  arabic: z.string().min(1),
  translation: z.string().min(1),
});

export const duaInput = z.object({
  id: z.string().min(1),
  category: z.string().min(1),
  title: z.string().min(1),
  reference: z.string(),
  arabic: z.string().min(1),
  khmer: z.string().min(1),
});

export const khutbahInput = z.object({
  id: z.string().min(1),
  topic: z.string().min(1),
  topicKm: z.string().min(1),
  titleKm: z.string().min(1),
  titleAr: z.string(),
  khatibAr: z.string(),
  mosque: z.string(),
  dateKm: z.string(),
  duration: z.string(),
  ayahAr: z.string(),
  body: z.array(z.string()),
});

export const tazkiyahEntry = z.object({
  type: z.enum(["quran", "hadith"]),
  arabic: z.string(),
  reference: z.string(),
  khmer: z.string(),
});

export const tazkiyahInput = z.object({
  id: z.string().min(1),
  kicker: z.string(),
  arabic: z.string(),
  title: z.string().min(1),
  short: z.string(),
  group: z.enum(["accent", "accent2"]),
  entries: z.array(tazkiyahEntry),
});

export const akhlaqReference = z.object({
  arabic: z.string(),
  khmer: z.string(),
  source: z.string(),
});

export const akhlaqInput = z.object({
  id: z.string().min(1),
  kicker: z.string(),
  arabic: z.string(),
  title: z.string().min(1),
  short: z.string(),
  long: z.string(),
  refs: z.array(akhlaqReference),
});

export const subject = z.enum(["aqidah", "figh", "arabic"]);

const tone = z.enum(["highlight", "success"]).optional();

export const contentBlock: z.ZodType<import("@punluesunnah/shared-types").ContentBlock> =
  z.lazy(() =>
    z.discriminatedUnion("type", [
      z.object({ type: z.literal("text"), text: z.string() }),
      z.object({ type: z.literal("definition"), label: z.string(), text: z.string() }),
      z.object({ type: z.literal("divider"), text: z.string() }),
      z.object({ type: z.literal("callout"), text: z.string(), tone }),
      z.object({
        type: z.literal("evidence"),
        kind: z.enum(["quran", "hadith"]),
        arabic: z.string(),
        intro: z.string().optional(),
        source: z.string().optional(),
        translation: z.string().optional(),
        translation_source: z.string().optional(),
      }),
      z.object({
        type: z.literal("section"),
        title: z.string(),
        blocks: z.array(contentBlock),
        number: z.string().optional(),
        tone,
      }),
    ]),
  );

export const lessonInput = z.object({
  arabic_title: z.string(),
  khmer_title: z.string().min(1),
  content: z.array(contentBlock),
});

export const bookInput = z.object({
  subject,
  arabic_title: z.string(),
  khmer_title: z.string().min(1),
});

export const video = z.object({
  id: z.string().min(1),
  title: z.string(),
  type: z.enum(["figh", "hadith", "akida"]),
});

export const ustazInput = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  image: z.string(),
  featured: z.boolean(),
  specialization: z.string(),
  description: z.string(),
  videos: z.array(video),
  social: z.object({
    facebook: z.string().nullable(),
    youtube: z.string().nullable(),
  }),
});

export const intId = z.coerce.number().int().positive();
