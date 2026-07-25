"use client";

import { useState } from "react";
import {
  Award,
  Brain,
  Clock,
  Heart,
  Moon,
  MoonStar,
  Scale,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { TAZKIYAH_TOPICS, type TazkiyahTopic } from "./tazkiyahData";

const TOPIC_ICONS: Record<string, LucideIcon> = {
  dhikr: Heart,
  sabr: Clock,
  tawakkul: Scale,
  salah: Moon,
  dua: Sparkles,
  shukr: Award,
  tafakkur: Brain,
  rest: MoonStar,
};

const GROUP_STYLES = {
  accent: {
    iconBg: "bg-[#fff2eb]",
    iconColor: "text-[#8c491a]",
    kicker: "text-[#c67139]",
  },
  accent2: {
    iconBg: "bg-[#f0fae1]",
    iconColor: "text-[#56633f]",
    kicker: "text-[#7a8a5e]",
  },
} as const;

const ENTRY_TAG_STYLES = {
  quran: "border-[#7a8a5e] text-[#56633f]",
  hadith: "border-[#c67139] text-[#8c491a]",
} as const;

const ENTRY_LABELS = {
  quran: "គម្ពីរគូរអាន",
  hadith: "ហាទីស",
} as const;

export default function TazkiyahLibrary() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected: TazkiyahTopic | null =
    TAZKIYAH_TOPICS.find((t) => t.id === selectedId) ?? null;

  return (
    <div className="overflow-hidden rounded-lg bg-[#f5ead8] px-6 py-10 sm:px-10 sm:py-12">
      <header className="mx-auto max-w-4xl">
        <span className="inline-block rounded-full bg-[#f0fae1] px-3 py-1 text-xs tracking-wide text-[#3d472b]">
          សុខភាពផ្លូវចិត្ត • ឥស្លាម
        </span>
        <h1 className="font-khmer mt-4 text-3xl leading-tight font-bold text-[#201e1d] sm:text-4xl lg:text-5xl">
          ភាពស្រស់ស្រាយចិត្ត ក្នុងគន្លងឥស្លាម
        </h1>
        <p className="font-khmer mt-3 max-w-[62ch] text-base leading-relaxed text-[#201e1d]/80">
          ជ្រើសរើសប្រធានបទខាងក្រោម ដើម្បីអានវាក្យខណ្ឌគួរអាន និងហាទីស
          ព្រមទាំងការពន្យល់សង្ខេប ស្តីពីរបៀបដែលឥស្លាមណែនាំឲ្យយើងរក្សាចិត្តឲ្យស្ងប់ស្ងាត់។
        </p>
      </header>

      <div className="mx-auto mt-8 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TAZKIYAH_TOPICS.map((topic) => {
          const Icon = TOPIC_ICONS[topic.id];
          const styles = GROUP_STYLES[topic.group];
          return (
            <button
              key={topic.id}
              type="button"
              onClick={() => setSelectedId(topic.id)}
              className="flex flex-col gap-2 rounded-[32px] bg-[#ebddc5] p-5 text-left shadow-[0_1px_2px_rgba(46,43,37,0.14)] transition hover:-translate-y-0.5 hover:shadow-[0_3px_10px_rgba(46,43,37,0.16)]"
            >
              <div
                className={`flex size-[52px] items-center justify-center rounded-full ${styles.iconBg}`}
              >
                <Icon className={styles.iconColor} size={24} strokeWidth={2.75} />
              </div>
              <span
                className={`text-[10px] font-medium tracking-[0.1em] uppercase ${styles.kicker}`}
              >
                {topic.kicker}
              </span>
              <span className="font-khmer text-lg font-bold text-[#201e1d]">
                {topic.title}
              </span>
              <p className="font-khmer text-sm leading-relaxed text-[#201e1d]/80">
                {topic.short}
              </p>
            </button>
          );
        })}
      </div>

      {selected && (
        <div
          role="presentation"
          onClick={() => setSelectedId(null)}
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#2e2b25]/50 p-4 py-12"
        >
          <div
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
            className="flex w-full max-w-xl flex-col gap-3 rounded-[32px] bg-[#f5ead8] p-6 shadow-[0_12px_32px_rgba(46,43,37,0.22)]"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-khmer text-xl font-bold text-[#201e1d]">
                {selected.title} — {selected.kicker}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                aria-label="Close"
                className="flex size-9 shrink-0 items-center justify-center rounded-full border border-[#201e1d]/16 text-[#201e1d] hover:bg-[#201e1d]/7"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col">
              {selected.entries.map((entry, i) => (
                <div
                  key={i}
                  className={`py-4 ${i === 0 ? "" : "border-t border-[#201e1d]/16"}`}
                >
                  <span
                    className={`inline-flex items-center rounded-full border px-3 py-0.5 text-xs ${ENTRY_TAG_STYLES[entry.type]}`}
                  >
                    {ENTRY_LABELS[entry.type]}
                  </span>
                  <p
                    dir="rtl"
                    lang="ar"
                    className="font-arabic mt-2 text-center text-xl leading-loose text-[#8c491a]"
                  >
                    {entry.arabic}
                  </p>
                  <p className="text-center text-xs text-[#201e1d]/60">
                    {entry.reference}
                  </p>
                  <p className="font-khmer mt-2 text-sm leading-relaxed text-[#201e1d]">
                    {entry.khmer}
                  </p>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setSelectedId(null)}
              className="font-khmer mt-1 self-end rounded-full border border-[#201e1d]/16 px-4 py-1.5 text-sm text-[#201e1d] hover:bg-[#201e1d]/7"
            >
              បិទ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
