"use client";

import { useState } from "react";
import {
  AKHLAQ_REFERENCES,
  AKHLAQ_VIRTUES,
  type AkhlaqVirtue,
} from "./akhlaqData";

export default function AkhlaqLibrary() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected: AkhlaqVirtue | null =
    AKHLAQ_VIRTUES.find((v) => v.id === selectedId) ?? null;

  return (
    <div className="overflow-hidden rounded-lg bg-surface">
      {/* Hero */}
      <section className="relative overflow-hidden px-6 py-16 sm:px-12 sm:py-20 lg:px-16 lg:py-24">
        <div className="pointer-events-none absolute -top-28 -right-24 size-[340px] rounded-full bg-[#ffe1d0] opacity-55" />
        <div className="pointer-events-none absolute -bottom-40 -left-24 size-[280px] rounded-full bg-[#e1eecc] opacity-50" />

        <div className="relative max-w-3xl">
          <span className="inline-block rounded-full bg-[#fff2eb] px-3 py-1 text-xs tracking-wide text-[#643312]">
            Personal reference
          </span>
          <h1 className="font-arabic mt-4 text-right text-6xl leading-tight text-[#643312] sm:text-7xl lg:text-[88px]">
            الأَخْلَاق
          </h1>
          <h2 className="font-khmer mt-3 text-xl font-semibold text-[#201e1d] sm:text-2xl">
            សីលធម៌ក្នុងឥស្លាម (Akhlaq — Islamic Character)
          </h2>
          <p className="font-arabic mt-4 text-right text-lg leading-loose text-[#201e1d] sm:text-xl">
            الأخلاقُ هي مجموعُ الصفاتِ والسجايا التي يتحلَّى بها الإنسانُ،
            ظاهرةً كانت أو باطنة، وهي ثمرةُ الإيمانِ وعنوانُ صدقِه.
          </p>
          <p className="font-khmer mt-3 text-sm leading-relaxed text-[#201e1d] sm:text-base">
            អាខ្លាក គឺជាបណ្តុំនៃលក្ខណៈសម្បត្តិ និងសីលធម៌ដែលមនុស្សម្នាក់កាន់កាប់
            ទាំងខាងក្រៅ និងខាងក្នុង។ វាគឺជាផលផ្លែនៃជំនឿ
            និងជាសញ្ញាបញ្ជាក់ពីភាពស្មោះត្រង់របស់វា។
          </p>
        </div>
      </section>

      <div className="mx-6 h-px bg-[#201e1d]/16 sm:mx-12 lg:mx-16" />

      {/* Pillars */}
      <section className="px-6 py-12 sm:px-12 lg:px-16">
        <h6 className="text-xs font-semibold tracking-[0.08em] text-[#8c491a] uppercase">
          ស្នូលចម្បង — Six Pillars
        </h6>
        <h3 className="mt-2 max-w-xl text-2xl font-bold text-[#201e1d] sm:text-3xl">
          Virtues at the heart of good character
        </h3>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {AKHLAQ_VIRTUES.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setSelectedId(v.id)}
              className="flex flex-col gap-2 rounded-[32px] bg-[#ebddc5] p-5 text-left shadow-[0_1px_2px_rgba(46,43,37,0.14)] transition hover:-translate-y-0.5 hover:shadow-[0_3px_10px_rgba(46,43,37,0.16)]"
            >
              <span className="text-[10px] font-medium tracking-[0.1em] text-[#c67139] uppercase">
                {v.kicker}
              </span>
              <span className="font-arabic text-right text-3xl text-[#643312]">
                {v.arabic}
              </span>
              <span className="font-khmer text-lg font-bold text-[#201e1d]">
                {v.title}
              </span>
              <p className="font-khmer text-sm leading-relaxed text-[#201e1d]/80">
                {v.short}
              </p>
              <span className="mt-1 inline-flex w-fit items-center rounded-full border border-[#c67139] px-3 py-1 text-xs text-[#c67139]">
                Read more ›
              </span>
            </button>
          ))}
        </div>
      </section>

      <div className="mx-6 h-px bg-[#201e1d]/16 sm:mx-12 lg:mx-16" />

      {/* Qur'an & Hadith */}
      <section className="px-6 py-12 sm:px-12 lg:px-16">
        <h6 className="text-xs font-semibold tracking-[0.08em] text-[#56633f] uppercase">
          ឯកសារយោង — References
        </h6>
        <h3 className="mt-2 max-w-xl text-2xl font-bold text-[#201e1d] sm:text-3xl">
          From the Qur&apos;an and Sunnah
        </h3>

        <div className="mt-8 flex flex-col gap-4">
          {AKHLAQ_REFERENCES.map((r, i) => (
            <div
              key={i}
              className="max-w-2xl rounded-[32px] bg-[#f9f4ed] p-5 shadow-[0_3px_10px_rgba(46,43,37,0.16)]"
            >
              <p className="font-arabic text-right text-2xl leading-loose text-[#643312]">
                {r.arabic}
              </p>
              <p className="font-khmer mt-2 text-sm text-[#201e1d]">
                {r.khmer}
              </p>
              <span className="mt-2 inline-flex items-center rounded-full bg-[#f0fae1] px-3 py-1 text-xs text-[#3d472b]">
                {r.source}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Closing */}
      <section className="max-w-xl px-6 py-16 sm:px-12 lg:px-16">
        <div className="mb-6 h-px bg-[#201e1d]/16" />
        <p className="font-arabic text-right text-xl leading-relaxed text-[#643312]">
          وَخَيْرُ النَّاسِ أَحْسَنُهُمْ خُلُقًا
        </p>
        <p className="font-khmer text-sm text-[#201e1d]/85">
          មនុស្សល្អបំផុត គឺជាអ្នកដែលមានសីលធម៌ល្អបំផុត — ចូរធ្វើសីលធម៌នេះឲ្យក្លាយជាផ្នែកមួយនៃជីវិតប្រចាំថ្ងៃ។
        </p>
      </section>

      {/* Detail dialog */}
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
              <div>
                <span className="inline-flex items-center rounded-full bg-[#f0fae1] px-3 py-1 text-xs text-[#3d472b]">
                  {selected.kicker}
                </span>
                <p className="font-arabic mt-2 text-right text-4xl text-[#643312]">
                  {selected.arabic}
                </p>
                <h3 className="font-khmer mt-1 text-xl font-bold text-[#201e1d]">
                  {selected.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                aria-label="Close"
                className="flex size-9 shrink-0 items-center justify-center rounded-full border border-[#201e1d]/16 text-[#201e1d] hover:bg-[#201e1d]/7"
              >
                ✕
              </button>
            </div>

            <p className="font-khmer text-sm leading-relaxed text-[#201e1d]/85">
              {selected.long}
            </p>

            <div className="h-px bg-[#201e1d]/16" />

            <h6 className="text-xs font-semibold tracking-[0.08em] text-[#8c491a] uppercase">
              ឯកសារយោង — Qur&apos;an &amp; Ḥadīth
            </h6>

            <div className="flex flex-col gap-3">
              {selected.refs.map((r, i) => (
                <div
                  key={i}
                  className="rounded-[32px] bg-[#f9f4ed] p-4 shadow-[0_1px_2px_rgba(46,43,37,0.14)]"
                >
                  <p className="font-arabic text-right text-xl leading-relaxed text-[#643312]">
                    {r.arabic}
                  </p>
                  <p className="font-khmer mt-2 text-sm text-[#201e1d]">
                    {r.khmer}
                  </p>
                  <span className="mt-2 inline-flex items-center rounded-full bg-[#f0fae1] px-3 py-1 text-xs text-[#3d472b]">
                    {r.source}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
