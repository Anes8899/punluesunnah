import type { FighContentBlock, FighTone } from "@/lib/figh-data";

const TONES: Record<FighTone, string> = {
  highlight: "border-amber/25 bg-peach text-amber",
  success: "border-badge-green-foreground/15 bg-badge-green text-badge-green-foreground",
};

function wrapArabic(kind: "quran" | "hadith", arabic: string) {
  return kind === "quran" ? `﴿ ${arabic} ﴾` : `(( ${arabic} ))`;
}

function Block({ block }: { block: FighContentBlock }) {
  switch (block.type) {
    case "text":
      return (
        <p className="text-base leading-loose text-ink">{block.text}</p>
      );

    case "definition":
      return (
        <div className="rounded-2xl border border-surface-border bg-surface-soft px-4 py-3.5">
          <p className="text-sm font-bold text-amber">{block.label} ៖</p>
          <p className="mt-1.5 text-base leading-loose text-ink">
            {block.text}
          </p>
        </div>
      );

    case "divider":
      return (
        <div className="flex items-center gap-3 py-1">
          <span className="h-px flex-1 bg-surface-border" />
          <span className="shrink-0 rounded-full bg-peach px-3 py-1 text-xs font-semibold text-amber">
            {block.text}
          </span>
          <span className="h-px flex-1 bg-surface-border" />
        </div>
      );

    case "callout":
      return (
        <p
          className={`rounded-2xl border px-4 py-3 text-center text-base leading-relaxed font-semibold ${
            TONES[block.tone ?? "highlight"]
          }`}
        >
          {block.text}
        </p>
      );

    case "evidence":
      return (
        <figure className="rounded-2xl border border-surface-border bg-surface-soft px-4 py-4">
          {block.intro && (
            <p className="mb-2.5 text-sm text-ink-muted">{block.intro}</p>
          )}

          <p className="font-arabic text-center text-2xl leading-loose text-amber">
            {wrapArabic(block.kind, block.arabic)}
          </p>

          {block.source && (
            <p className="font-arabic mt-1 text-center text-xs text-ink-muted">
              [{block.source}]
            </p>
          )}

          {block.translation && (
            <figcaption className="mt-3 border-t border-surface-border pt-3 text-center text-sm leading-loose text-ink italic">
              &ldquo;{block.translation}&rdquo;
            </figcaption>
          )}

          {block.translation_source && (
            <p className="mt-1 text-center text-xs text-ink-muted">
              [{block.translation_source}]
            </p>
          )}
        </figure>
      );

    case "section": {
      const tone = block.tone ? TONES[block.tone] : "border-surface-border";
      return (
        <section className={`rounded-2xl border ${tone} px-4 py-4`}>
          <h2 className="mb-3.5 flex items-center gap-2.5 text-lg leading-snug font-bold text-ink">
            {block.number && (
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-peach text-sm font-bold text-amber">
                {block.number}
              </span>
            )}
            <span className="min-w-0 flex-1">{block.title}</span>
          </h2>

          <Blocks blocks={block.blocks} />
        </section>
      );
    }
  }
}

function Blocks({ blocks }: { blocks: FighContentBlock[] }) {
  return (
    <div className="grid gap-3.5">
      {blocks.map((block, i) => (
        <Block key={i} block={block} />
      ))}
    </div>
  );
}

export default function FighLessonContent({
  content,
}: {
  content: FighContentBlock[];
}) {
  return <Blocks blocks={content} />;
}
