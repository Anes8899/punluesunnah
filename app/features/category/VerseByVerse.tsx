import {
  BookMarked,
  BookOpen,
  GraduationCap,
  Lightbulb,
  MessageCircle,
} from "lucide-react";
import type { Verse } from "@/lib/getVerses";
import AyahMarker from "./AyahMarker";

const LINKS = [
  { label: "Tafsirs", icon: BookOpen },
  { label: "Lessons", icon: GraduationCap },
  { label: "Reflections", icon: MessageCircle },
  { label: "Answers", icon: Lightbulb },
  { label: "Hadith", icon: BookMarked },
];

export default function VerseByVerse({ verses }: { verses: Verse[] }) {
  return (
    <div dir="ltr">
      {verses.map((verse) => (
        <div
          key={verse.id}
          className="border-b border-surface-border py-6 first:pt-0 last:border-b-0"
        >
          <div
            dir="rtl"
            className="font-arabic flex flex-wrap items-baseline justify-end gap-x-2 text-right text-3xl leading-loose text-ink md:text-4xl"
          >
            <span>{verse.text_uthmani}</span>
            <AyahMarker number={verse.verse_number} />
          </div>

          <p className="mt-4 text-lg text-ink">
            {verse.verse_number}.{" "}
            <span
              dangerouslySetInnerHTML={{
                __html: verse.translations[0]?.text ?? "",
              }}
            />
          </p>

          <div className="mt-4 flex items-center gap-3 overflow-x-auto text-sm whitespace-nowrap text-ink-muted">
            {LINKS.map((link, index) => (
              <div key={link.label} className="flex items-center gap-3">
                {index > 0 && <span className="text-ink-muted/50">|</span>}
                <button
                  type="button"
                  className="flex shrink-0 items-center gap-1.5 py-1 hover:text-ink"
                >
                  <link.icon className="size-4" />
                  {link.label}
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
