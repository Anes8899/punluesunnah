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
import Link from "next/link";
import { KHUTBAHS, KHUTBAH_TOPICS, type Khutbah } from "./khutbahData";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/app/ui/breadcrumb";

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
      <div className="mx-auto max-w-3xl mb-5 pb-16">
        <Breadcrumb className="mb-3">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">ទំព័រដើម</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <button type="button" onClick={() => setView("list")}>
                  បណ្ណសារសុន្ទរកថា
                </button>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="max-w-[16rem] truncate sm:max-w-none">
                {selected.titleKm}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mt-4 flex aspect-[21/9] items-center justify-center rounded-lg bg-gradient-to-br from-brand/15 to-brand/5">
          <BookOpen className="text-brand/40" size={48} strokeWidth={1.5} />
        </div>

        <span className="mt-4 inline-flex items-center rounded-full bg-brand/10 px-3 py-1 text-xs font-medium text-brand">
          {selected.topicKm}
        </span>

        <h1 className="mt-3 text-2xl font-bold text-ink sm:text-3xl">
          {selected.titleKm}
        </h1>
        <p className="font-arabic mt-2 text-right text-xl text-brand">
          {selected.titleAr}
        </p>

        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 border-b border-surface-border pb-4 text-sm text-ink-muted">
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

        <div className="mt-6 flex items-center gap-4 rounded-lg bg-card p-4 shadow-sm">
          <button
            onClick={() => setIsPlaying((p) => !p)}
            aria-label={isPlaying ? "ផ្អាក" : "ចាក់"}
            className="flex size-12 shrink-0 items-center justify-center rounded-full bg-brand text-brand-foreground transition hover:bg-brand/90"
          >
            {isPlaying ? (
              <Pause size={20} fill="currentColor" />
            ) : (
              <Play size={20} fill="currentColor" className="ml-0.5" />
            )}
          </button>
          <div className="flex-1">
            <p className="mb-1.5 text-xs text-ink-muted">
              ស្តាប់សំឡេងសុន្ទរកថា
            </p>
            <div className="h-1.5 overflow-hidden rounded-full bg-surface-border">
              <div
                className="h-full rounded-full bg-brand"
                style={{ width: isPlaying ? "30%" : "0%" }}
              />
            </div>
          </div>
          <button
            aria-label="រក្សាទុក"
            className="flex size-9 shrink-0 items-center justify-center rounded-full border border-surface-border text-ink-muted transition hover:bg-surface-soft"
          >
            <Bookmark size={16} strokeWidth={2.75} />
          </button>
          <button
            aria-label="ចែករំលែក"
            className="flex size-9 shrink-0 items-center justify-center rounded-full border border-surface-border text-ink-muted transition hover:bg-surface-soft"
          >
            <Share2 size={16} strokeWidth={2.75} />
          </button>
        </div>

        <p className="font-arabic mt-8 text-center text-2xl text-brand">
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </p>

        <h2 className="mt-6 text-xs font-semibold tracking-wide text-ink-muted/70 uppercase">
          អត្ថបទសុន្ទរកថា
        </h2>
        <div className="mt-4 flex flex-col gap-4">
          {selected.body.map((p, i) => (
            <p key={i} className="text-base leading-relaxed text-ink">
              {p}
            </p>
          ))}
        </div>

        <blockquote className="mt-6 rounded-lg border-l-4 border-brand bg-brand/5 p-4">
          <p
            dir="rtl"
            lang="ar"
            className="font-arabic text-xl leading-loose text-brand"
          >
            {selected.ayahAr}
          </p>
        </blockquote>

        <h2 className="mt-8 text-xs font-semibold tracking-wide text-ink-muted/70 uppercase">
          សុន្ទរកថាទាក់ទង
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {related.map((r) => (
            <button
              key={r.id}
              onClick={() => openDetail(r.id)}
              className="rounded-lg bg-card p-4 text-left shadow-sm transition hover:shadow-md"
            >
              <span className="mb-2 inline-block rounded-full bg-brand/10 px-2 py-0.5 text-[11px] font-medium text-brand">
                {r.topicKm}
              </span>
              <p className="text-sm font-semibold text-ink">
                {r.titleKm}
              </p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl pb-16">
      <Breadcrumb className="mb-3">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">ទំព័រដើម</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>បណ្ណសារសុន្ទរកថាថ្ងៃសុក្រ</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header className="max-w-2xl">
        <h1 className="text-2xl font-bold text-ink sm:text-3xl">
          បណ្ណសារសុន្ទរកថាថ្ងៃសុក្រ
        </h1>
        <p className="font-arabic mt-1 text-xl text-brand">
          أرشيف خطبة الجمعة
        </p>
        <p className="mt-3 text-sm text-ink-muted">
          ស្តាប់ និងអានឡើងវិញនូវសុន្ទរកថាថ្ងៃសុក្រពីអ្នកទេសនានៅម៉ស្ជិទក្នុងសហគមន៍របស់យើង។
        </p>
      </header>

      <div className="mt-6 flex items-center gap-3">
        <div className="relative flex-1">
          <Search
            size={16}
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-ink-muted/70"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ស្វែងរកសុន្ទរកថា ឬឈ្មោះអ្នកទេសនា..."
            className="w-full rounded-lg border border-surface-border bg-card py-2 pr-3 pl-9 text-sm text-ink outline-none placeholder:text-ink-muted/70 focus:border-brand"
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTopic(null)}
          className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
            !activeTopic
              ? "bg-brand text-brand-foreground"
              : "bg-surface text-ink-muted hover:bg-surface-border"
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
                ? "bg-brand text-brand-foreground"
                : "bg-surface text-ink-muted hover:bg-surface-border"
            }`}
          >
            {t.labelKm}
          </button>
        ))}
      </div>

      <p className="mt-6 text-xs text-ink-muted/70">{filtered.length} សុន្ទរកថា</p>

      <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((k) => (
          <button
            key={k.id}
            onClick={() => openDetail(k.id)}
            className="flex flex-col overflow-hidden rounded-lg bg-card text-left shadow-sm transition hover:shadow-md"
          >
            <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-brand/15 to-brand/5">
              <BookOpen className="text-brand/40" size={32} strokeWidth={1.5} />
            </div>
            <div className="flex flex-1 flex-col gap-1.5 p-4">
              <span className="inline-flex w-fit items-center rounded-full bg-brand/10 px-2.5 py-0.5 text-[11px] font-medium text-brand">
                {k.topicKm}
              </span>
              <p className="text-base font-semibold text-ink">
                {k.titleKm}
              </p>
              <p className="font-arabic text-sm text-brand">{k.titleAr}</p>
              <p
                dir="rtl"
                lang="ar"
                className="font-arabic truncate text-xs text-ink-muted/70"
              >
                {k.khatibAr}
              </p>
              <div className="mt-auto flex items-center gap-2 pt-2 text-xs text-ink-muted/70">
                <span>{k.dateKm}</span>
                <span>·</span>
                <span>{k.duration}</span>
              </div>
            </div>
          </button>
        ))}

        {filtered.length === 0 && (
          <p className="col-span-full rounded-lg bg-card py-8 text-center text-sm text-ink-muted shadow-sm">
            គ្មានសុន្ទរកថាត្រូវនឹងលក្ខខណ្ឌនេះទេ
          </p>
        )}
      </div>
    </div>
  );
}
