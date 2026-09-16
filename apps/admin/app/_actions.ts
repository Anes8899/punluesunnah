"use server";

import { updateTag } from "next/cache";
import type { LessonInput, UstazInput } from "@punluesunnah/shared-types";
import { ApiError } from "@punluesunnah/api-client/client";
import { TAGS, updateLesson, updateUstaz } from "@punluesunnah/api-client/content";
import { revalidateWeb } from "@/lib/revalidateWeb";

// Server Actions are the only path from the admin UI to content-service
// writes: the API key stays on the server. Each save expires the tag the
// admin lists were cached under here, and the same tag on the public web app.
//
// There is no login yet, so anyone who can reach this app can call these. Put an
// auth check at the top of each action when accounts are added.

export type ActionResult = { ok: true } | { ok: false; error: string };

async function run(fn: () => Promise<void>): Promise<ActionResult> {
  try {
    await fn();
    return { ok: true };
  } catch (err) {
    console.error("[admin action]", err);
    const message =
      err instanceof ApiError && err.status === 400
        ? "ទិន្នន័យមិនត្រឹមត្រូវ"
        : "រក្សាទុកមិនបានសម្រេច";
    return { ok: false, error: message };
  }
}

export async function saveUstazAction(id: number, input: UstazInput): Promise<ActionResult> {
  return run(async () => {
    await updateUstaz(id, input);
    updateTag(TAGS.ustaz);
    await revalidateWeb([TAGS.ustaz]);
  });
}

export async function saveLessonAction(
  bookKey: string,
  lessonId: number,
  input: LessonInput,
): Promise<ActionResult> {
  return run(async () => {
    await updateLesson(bookKey, lessonId, input);
    updateTag(TAGS.books);
    await revalidateWeb([TAGS.books]);
  });
}
