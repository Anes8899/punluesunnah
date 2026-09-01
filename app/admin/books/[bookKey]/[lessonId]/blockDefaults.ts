import type { ContentBlock } from "@/app/admin/_data/books";

export const BLOCK_LABEL: Record<ContentBlock["type"], string> = {
  text: "អត្ថបទ",
  definition: "និយមន័យ",
  divider: "បន្ទាត់ខណ្ឌ",
  callout: "ប្រអប់សំខាន់",
  evidence: "ភស្តុតាង",
  section: "ផ្នែក",
};

export function emptyBlock(type: ContentBlock["type"]): ContentBlock {
  switch (type) {
    case "text":
      return { type: "text", text: "" };
    case "definition":
      return { type: "definition", label: "", text: "" };
    case "divider":
      return { type: "divider", text: "" };
    case "callout":
      return { type: "callout", text: "" };
    case "evidence":
      return { type: "evidence", kind: "quran", arabic: "" };
    case "section":
      return { type: "section", title: "", blocks: [] };
  }
}
