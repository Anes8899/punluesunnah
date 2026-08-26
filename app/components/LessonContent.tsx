export type Tone = "highlight" | "success";

export type ContentBlock =
  | { type: "text"; text: string }
  | { type: "definition"; label: string; text: string }
  | { type: "divider"; text: string }
  | { type: "callout"; text: string; tone?: Tone }
  | {
      type: "evidence";
      kind: "quran" | "hadith";
      arabic: string;
      intro?: string;
      source?: string;
      translation?: string;
      translation_source?: string;
    }
  | {
      type: "section";
      title: string;
      blocks: ContentBlock[];
      number?: string;
      tone?: Tone;
    };

const TONES: Record<Tone, string> = {
  highlight: "bg-peach/50 text-amber",
  success: "bg-badge-green/50 text-badge-green-foreground",
};

const SURFACE = "bg-badge-green/30 shadow-sm";

function wrapArabic(kind: "quran" | "hadith", arabic: string) {
  return kind === "quran" ? `﴿ ${arabic} ﴾` : `(( ${arabic} ))`;
}

function Block({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "text":
      return (
        <p className="text-base leading-loose text-ink lg:text-lg">
          {block.text}
        </p>
      );

    case "definition":
      return (
        <div className={`rounded-2xl px-4 py-3.5 lg:px-6 lg:py-5 ${SURFACE}`}>
          <p className="text-sm font-bold text-badge-green-foreground lg:text-base">
            {block.label} ៖
          </p>
          <p className="mt-1.5 text-base leading-loose text-ink lg:text-lg">
            {block.text}
          </p>
        </div>
      );

    case "divider":
      return (
        <div className="flex items-center gap-3 py-1 lg:py-2">
          <span className="h-px flex-1 bg-surface-border" />
          <span className="shrink-0 rounded-full bg-badge-green px-3 py-1 text-xs font-semibold text-badge-green-foreground lg:px-4 lg:py-1.5 lg:text-sm">
            {block.text}
          </span>
          <span className="h-px flex-1 bg-surface-border" />
        </div>
      );

    case "callout":
      return (
        <p
          className={`rounded-2xl px-4 py-3 text-center text-base leading-relaxed font-semibold shadow-sm lg:px-6 lg:py-4 lg:text-lg ${
            TONES[block.tone ?? "highlight"]
          }`}
        >
          {block.text}
        </p>
      );

    case "evidence":
      return (
        <figure className={`rounded-2xl px-4 py-4 lg:px-8 lg:py-6 ${SURFACE}`}>
          {block.intro && (
            <p className="mb-2.5 text-sm text-ink-muted lg:mb-3.5 lg:text-base">
              {block.intro}
            </p>
          )}

          <p className="font-arabic text-center text-2xl leading-loose text-amber lg:text-3xl">
            {wrapArabic(block.kind, block.arabic)}
          </p>

          {block.source && (
            <p className="font-arabic mt-1 text-center text-xs text-ink-muted lg:text-sm">
              [{block.source}]
            </p>
          )}

          {block.translation && (
            <figcaption className="mt-3.5 text-center text-sm leading-loose text-ink italic lg:mt-4 lg:text-base">
              &ldquo;{block.translation}&rdquo;
            </figcaption>
          )}

          {block.translation_source && (
            <p className="mt-1 text-center text-xs text-ink-muted lg:text-sm">
              [{block.translation_source}]
            </p>
          )}
        </figure>
      );

    case "section": {
      const tone = block.tone ? TONES[block.tone] : SURFACE;
      return (
        <section
          className={`rounded-2xl px-4 py-4 shadow-sm lg:px-6 lg:py-5 ${tone}`}
        >
          <h2 className="mb-3.5 flex items-center gap-2.5 text-lg leading-snug font-bold text-ink lg:mb-4 lg:gap-3 lg:text-xl">
            {block.number && (
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-badge-green text-sm font-bold text-badge-green-foreground shadow-sm lg:size-8 lg:text-base">
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

function Blocks({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="grid gap-3.5 lg:gap-5">
      {blocks.map((block, i) => (
        <Block key={i} block={block} />
      ))}
    </div>
  );
}

export default function LessonContent({
  content,
}: {
  content: ContentBlock[];
}) {
  return <Blocks blocks={content} />;
}
