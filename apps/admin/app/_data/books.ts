import type { ContentBlock, Subject } from "@punluesunnah/shared-types";

// Client-safe constants for the books admin screens. Data access lives in
// `@punluesunnah/api-client` (server only); nothing here may import it, because
// BlockList and the editors are Client Components.

/**
 * content-service stores aqidah, figh and arabic books as one entity
 * discriminated by `subject`, so a single set of admin screens covers all three.
 */
export const SUBJECTS = ["aqidah", "figh", "arabic"] as const satisfies readonly Subject[];

export const SUBJECT_LABEL: Record<Subject, string> = {
  aqidah: "គោលជំនឿ",
  figh: "ហ្វិកហ៍",
  arabic: "ភាសាអារ៉ាប់",
};

export const BLOCK_TYPES = [
  "text",
  "definition",
  "divider",
  "callout",
  "evidence",
  "section",
] as const satisfies readonly ContentBlock["type"][];
