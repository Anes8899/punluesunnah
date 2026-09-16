import "server-only";
import type { Chapter, Verse } from "@punluesunnah/shared-types";
import { getJson, mustGetJson, serviceUrl } from "./client";

// The mushaf never changes; the service caches it in memory and we cache it
// again in the data cache so a page render costs no network at all.
const REVALIDATE = 60 * 60 * 24;

export const getChapters = () =>
  mustGetJson<Chapter[]>(`${serviceUrl("QURAN")}/chapters`, { revalidate: REVALIDATE });

/** `undefined` when the chapter id is out of range. */
export const getVerses = (chapterId: number) =>
  getJson<Verse[]>(`${serviceUrl("QURAN")}/chapters/${chapterId}/verses`, {
    revalidate: REVALIDATE,
  });
