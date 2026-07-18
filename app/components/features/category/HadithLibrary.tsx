"use client";

import { useMemo, useState } from "react";
import { HADITHS, type Hadith } from "./hadithData";

export default function HadithLibrary() {
  const [selectedId, setSelectedId] = useState<number>(HADITHS[0].id);
  const [activeCollection, setActiveCollection] = useState<string | null>(null);
  const [activeTopic, setActiveTopic] = useState<string | null>(null);

  const collections = useMemo(() => {
    const counts = new Map<string, number>();
    for (const h of HADITHS) counts.set(h.collection, (counts.get(h.collection) ?? 0) + 1);
    return [...counts.entries()].sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
  }, []);

  const topics = useMemo(
    () =>
      [...new Set(HADITHS.map((h) => h.topic))].sort((a, b) =>
        a < b ? -1 : a > b ? 1 : 0,
      ),
    [],
  );

  const filtered = useMemo(
    () =>
      HADITHS.filter(
        (h) =>
          (!activeCollection || h.collection === activeCollection) &&
          (!activeTopic || h.topic === activeTopic),
      ),
    [activeCollection, activeTopic],
  );

  const selected: Hadith | undefined =
    filtered.find((h) => h.id === selectedId) ?? filtered[0];

  const toggleTopic = (topic: string) =>
    setActiveTopic((current) => (current === topic ? null : topic));

  return (
    <div className="mx-auto max-w-6xl">
      <header className="rounded-lg bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
          បណ្ណាល័យហាទីស
        </h1>
        <p className="mt-2 max-w-[70ch] text-sm text-slate-500">
          ការប្រមូលហាទីសដែលអាចរុករកបានតាមប្រភព និងប្រធានបទ ព្រមទាំងអត្ថបទអារ៉ាប់ដើម។
        </p>
      </header>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[200px_360px_1fr] lg:items-start">
        <aside className="rounded-lg bg-white p-4 shadow-sm lg:sticky lg:top-4">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-[#00966b]">
              ការប្រមូល
            </h2>
            <div className="mt-2 flex flex-col gap-1">
              <button
                onClick={() => setActiveCollection(null)}
                className={`flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left text-sm transition ${
                  !activeCollection
                    ? "bg-[#00966b]/10 font-medium text-[#00966b]"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span>ការប្រមូលទាំងអស់</span>
                <span className="text-xs opacity-60">{HADITHS.length}</span>
              </button>
              {collections.map(([name, count]) => (
                <button
                  key={name}
                  onClick={() =>
                    setActiveCollection((current) => (current === name ? null : name))
                  }
                  className={`flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left text-sm transition ${
                    activeCollection === name
                      ? "bg-[#00966b]/10 font-medium text-[#00966b]"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span className="truncate">{name}</span>
                  <span className="text-xs opacity-60">{count}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              ប្រធានបទ
            </h2>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {topics.map((topic) => (
                <button
                  key={topic}
                  onClick={() => toggleTopic(topic)}
                  className={`rounded-full px-2.5 py-1 text-xs transition ${
                    activeTopic === topic
                      ? "bg-[#00966b] text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <section className="rounded-lg bg-white p-4 shadow-sm">
          <p className="mb-3 px-1 text-xs text-slate-500">
            ហាទីស {filtered.length} ខ្នាត
          </p>
          <div className="flex flex-col gap-3">
            {filtered.map((h) => {
              const active = h.id === selected?.id;
              return (
                <button
                  key={h.id}
                  onClick={() => setSelectedId(h.id)}
                  className={`rounded-lg border p-3 text-left transition ${
                    active
                      ? "border-[#00966b] bg-[#00966b]/5 shadow-sm"
                      : "border-transparent bg-slate-50 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-medium uppercase tracking-wide text-[#00966b]">
                      {h.collection} {h.refNumber}
                    </span>
                    <span className="ml-auto shrink-0 rounded-full bg-[#00966b]/10 px-2 py-0.5 text-[10px] font-medium text-[#00966b]">
                      {h.grade}
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-semibold text-slate-800">{h.topic}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-slate-500">{h.translation}</p>
                  <p
                    dir="rtl"
                    lang="ar"
                    className="font-arabic mt-1 truncate text-right text-sm text-[#00966b]/80"
                  >
                    {h.arabic}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">រៀបរាប់ដោយ {h.narrator}</p>
                </button>
              );
            })}
            {filtered.length === 0 && (
              <p className="py-8 text-center text-sm text-slate-500">
                គ្មានហាទីសត្រូវនឹងលក្ខខណ្ឌនេះទេ
              </p>
            )}
          </div>
        </section>

        <section className="rounded-lg bg-white p-6 shadow-sm sm:p-8">
          {selected ? (
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-[#00966b]/10 px-3 py-1 text-xs font-medium text-[#00966b]">
                  {selected.collection}
                </span>
                <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  {selected.book}
                </span>
                <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                  {selected.grade}
                </span>
              </div>

              <h2 className="mt-4 text-2xl font-bold text-slate-800 sm:text-3xl">
                {selected.topic}
              </h2>

              <p
                dir="rtl"
                lang="ar"
                className="font-arabic mt-6 rounded-lg bg-slate-50 px-5 py-4 text-right text-2xl leading-loose text-slate-800"
              >
                {selected.arabic}
              </p>

              <p className="mt-6 text-lg leading-relaxed text-slate-600">
                &ldquo;{selected.translation}&rdquo;
              </p>

              <hr className="my-6 border-slate-200" />

              <dl className="grid grid-cols-[140px_1fr] gap-y-2.5 text-sm">
                <dt className="text-slate-400">អ្នករៀបរាប់</dt>
                <dd className="text-slate-700">{selected.narrator}</dd>
                <dt className="text-slate-400">ឯកសារយោង</dt>
                <dd className="text-slate-700">
                  {selected.collection}, {selected.refNumber}
                </dd>
                <dt className="text-slate-400">សៀវភៅ</dt>
                <dd className="text-slate-700">{selected.book}</dd>
                <dt className="text-slate-400">កម្រិតត្រឹមត្រូវ</dt>
                <dd className="text-slate-700">{selected.grade}</dd>
              </dl>

              <div className="mt-8 flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-400">ប្រធានបទ</span>
                <button
                  onClick={() => toggleTopic(selected.topic)}
                  className="rounded-full border border-[#00966b] px-3 py-1 text-xs text-[#00966b] transition hover:bg-[#00966b]/5"
                >
                  {selected.topic}
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500">សូមជ្រើសរើសហាទីសមួយ</p>
          )}
        </section>
      </div>
    </div>
  );
}
