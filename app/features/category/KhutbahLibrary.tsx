"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Bookmark,
  BookOpen,
  Pause,
  Play,
  Search,
  Share2,
} from "lucide-react";
import { KHUTBAHS, KHUTBAH_TOPICS, type Khutbah } from "./khutbahData";

export default function KhutbahLibrary() {
  const [view, setView] = useState<"list" | "detail">("list");
  const [selectedId, setSelectedId] = useState<string>(KHUTBAHS[0].id);
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return KHUTBAHS.filter((k) => {
      const topicOk = !activeTopic || k.topic === activeTopic;
      const qOk =
        !q ||
        k.titleKm.toLowerCase().includes(q) ||
        k.khatibAr.toLowerCase().includes(q);
      return topicOk && qOk;
    });
  }, [activeTopic, query]);

  const selected: Khutbah =
    KHUTBAHS.find((k) => k.id === selectedId) ?? KHUTBAHS[0];

  const related = useMemo(
    () => KHUTBAHS.filter((k) => k.id !== selected.id).slice(0, 3),
    [selected],
  );

  const openDetail = (id: string) => {
    setSelectedId(id);
    setIsPlaying(false);
    setView("detail");
  };

  if (view === "detail") {
    return (
      <div className="mx-auto max-w-3xl">
        <button
          onClick={() => setView("list")}
          className="flex items-center gap-1.5 text-sm font-medium text-[#00966b] hover:underline"
        >
          <ArrowLeft size={16} strokeWidth={2.75} />
          ត្រឡប់ក្រោយ
        </button>

        <div className="mt-4 flex aspect-[21/9] items-center justify-center rounded-lg bg-gradient-to-br from-[#00966b]/15 to-[#00966b]/5">
          <BookOpen className="text-[#00966b]/40" size={48} strokeWidth={1.5} />
        </div>

        <span className="mt-4 inline-flex items-center rounded-full bg-[#00966b]/10 px-3 py-1 text-xs font-medium text-[#00966b]">
          {selected.topicKm}
        </span>

        <h1 className="mt-3 text-2xl font-bold text-slate-800 sm:text-3xl">
          {selected.titleKm}
        </h1>
        <p className="font-arabic mt-2 text-right text-xl text-[#00966b]">
          {selected.titleAr}
        </p>

        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 border-b border-slate-200 pb-4 text-sm text-slate-500">
          <span>
            អ៊ីម៉ាំ{" "}
            <span className="font-arabic" dir="rtl" lang="ar">
              {selected.khatibAr}
            </span>
          </span>
          <span>{selected.mosque}</span>
          <span>{selected.dateKm}</span>
          <span>{selected.duration}</span>
        </div>

        <div className="mt-6 flex items-center gap-4 rounded-lg bg-white p-4 shadow-sm">
          <button
            onClick={() => setIsPlaying((p) => !p)}
            aria-label={isPlaying ? "ផ្អាក" : "ចាក់"}
            className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#00966b] text-white transition hover:bg-[#00966b]/90"
          >
            {isPlaying ? (
              <Pause size={20} fill="currentColor" />
            ) : (
              <Play size={20} fill="currentColor" className="ml-0.5" />
            )}
          </button>
          <div className="flex-1">
            <p className="mb-1.5 text-xs text-slate-500">
              ស្តាប់សំឡេងសុន្ទរកថា
            </p>
            <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-[#00966b]"
                style={{ width: isPlaying ? "30%" : "0%" }}
              />
            </div>
          </div>
          <button
            aria-label="រក្សាទុក"
            className="flex size-9 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-50"
          >
            <Bookmark size={16} strokeWidth={2.75} />
          </button>
          <button
            aria-label="ចែករំលែក"
            className="flex size-9 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-50"
          >
            <Share2 size={16} strokeWidth={2.75} />
          </button>
        </div>

        <p className="font-arabic mt-8 text-center text-2xl text-[#00966b]">
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </p>

        <h2 className="mt-6 text-xs font-semibold tracking-wide text-slate-400 uppercase">
          អត្ថបទសុន្ទរកថា
        </h2>
        <div className="mt-4 flex flex-col gap-4">
          {selected.body.map((p, i) => (
            <p key={i} className="text-base leading-relaxed text-slate-700">
              {p}
            </p>
          ))}
        </div>

        <blockquote className="mt-6 rounded-lg border-l-4 border-[#00966b] bg-[#00966b]/5 p-4">
          <p
            dir="rtl"
            lang="ar"
            className="font-arabic text-xl leading-loose text-[#00966b]"
          >
            {selected.ayahAr}
          </p>
        </blockquote>

        <h2 className="mt-8 text-xs font-semibold tracking-wide text-slate-400 uppercase">
          សុន្ទរកថាទាក់ទង
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {related.map((r) => (
            <button
              key={r.id}
              onClick={() => openDetail(r.id)}
              className="rounded-lg bg-white p-4 text-left shadow-sm transition hover:shadow-md"
            >
              <span className="mb-2 inline-block rounded-full bg-[#00966b]/10 px-2 py-0.5 text-[11px] font-medium text-[#00966b]">
                {r.topicKm}
              </span>
              <p className="text-sm font-semibold text-slate-800">
                {r.titleKm}
              </p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <header className="max-w-2xl">
        <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
          បណ្ណសារសុន្ទរកថាថ្ងៃសុក្រ
        </h1>
        <p className="font-arabic mt-1 text-xl text-[#00966b]">
          أرشيف خطبة الجمعة
        </p>
        <p className="mt-3 text-sm text-slate-500">
          ស្តាប់ និងអានឡើងវិញនូវសុន្ទរកថាថ្ងៃសុក្រពីអ្នកទេសនានៅម៉ស្ជិទក្នុងសហគមន៍របស់យើង។
        </p>
      </header>

      <div className="mt-6 flex items-center gap-3">
        <div className="relative flex-1">
          <Search
            size={16}
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ស្វែងរកសុន្ទរកថា ឬឈ្មោះអ្នកទេសនា..."
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pr-3 pl-9 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-[#00966b]"
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTopic(null)}
          className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
            !activeTopic
              ? "bg-[#00966b] text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          ទាំងអស់
        </button>
        {KHUTBAH_TOPICS.map((t) => (
          <button
            key={t.id}
            onClick={() =>
              setActiveTopic((current) => (current === t.id ? null : t.id))
            }
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
              activeTopic === t.id
                ? "bg-[#00966b] text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {t.labelKm}
          </button>
        ))}
      </div>

      <p className="mt-6 text-xs text-slate-400">{filtered.length} សុន្ទរកថា</p>

      <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((k) => (
          <button
            key={k.id}
            onClick={() => openDetail(k.id)}
            className="flex flex-col overflow-hidden rounded-lg bg-white text-left shadow-sm transition hover:shadow-md"
          >
            <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-[#00966b]/15 to-[#00966b]/5">
              <BookOpen className="text-[#00966b]/40" size={32} strokeWidth={1.5} />
            </div>
            <div className="flex flex-1 flex-col gap-1.5 p-4">
              <span className="inline-flex w-fit items-center rounded-full bg-[#00966b]/10 px-2.5 py-0.5 text-[11px] font-medium text-[#00966b]">
                {k.topicKm}
              </span>
              <p className="text-base font-semibold text-slate-800">
                {k.titleKm}
              </p>
              <p className="font-arabic text-sm text-[#00966b]">{k.titleAr}</p>
              <p
                dir="rtl"
                lang="ar"
                className="font-arabic truncate text-xs text-slate-400"
              >
                {k.khatibAr}
              </p>
              <div className="mt-auto flex items-center gap-2 pt-2 text-xs text-slate-400">
                <span>{k.dateKm}</span>
                <span>·</span>
                <span>{k.duration}</span>
              </div>
            </div>
          </button>
        ))}

        {filtered.length === 0 && (
          <p className="col-span-full rounded-lg bg-white py-8 text-center text-sm text-slate-500 shadow-sm">
            គ្មានសុន្ទរកថាត្រូវនឹងលក្ខខណ្ឌនេះទេ
          </p>
        )}
      </div>
    </div>
  );
}
