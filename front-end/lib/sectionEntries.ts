import type { CollectionEntry } from "@/app/components/CardCollection";
import type { ContentBlock } from "@/types";

/**
 * The section outline of a lesson, as nested accordion entries. Only titles
 * are kept — the lesson content itself is too large to send to the client.
 */
export function sectionEntries(
  blocks: ContentBlock[],
  href: string,
  keyPrefix = "",
): CollectionEntry[] {
  return blocks.flatMap((block, i) => {
    if (block.type !== "section") return [];
    const key = `${keyPrefix}${i}`;
    return [
      {
        key,
        href,
        badge: block.number,
        khmerTitle: block.title,
        entries: sectionEntries(block.blocks, href, `${key}-`),
      },
    ];
  });
}
