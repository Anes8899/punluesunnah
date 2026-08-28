"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  ListFilter,
  Minus,
  Plus,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/app/ui/breadcrumb";
import { HADITHS, type Hadith } from "./hadithData";
import { foldQuery, highlight, matches, type SearchMode } from "./hadithSearch";

const PAGE_SIZE = 5;
const MIN_FONT = 16;
const MAX_FONT = 34;

const SEARCH_MODES: { value: SearchMode; label: string }[] = [
  { value: "word", label: "ស្វែងរកតាមពាក្យ" },
  { value: "topic", label: "ស្វែងរកតាមប្រធានបទ" },
];

function gradeTone(grade: string) {
  if (grade.includes("សហ៊ីហ៍")) return "bg-badge-green text-badge-green-foreground";
  if (grade.includes("ហាសាន់")) return "bg-peach text-amber-ink";
  return "bg-surface text-ink-muted";
}

function Highlighted({ text, terms }: { text: string; terms: string[] }) {
  return (
    <>
      {highlight(text, terms).map((segment, index) =>
        segment.hit ? (
          <mark
            key={index}
            className="rounded-sm bg-transparent font-bold text-amber-ink"
          >
            {segment.text}
          </mark>
        ) : (
          <span key={index}>{segment.text}</span>
        ),
      )}
    </>
  );
}

export default function HadithLibrary() {
  const [query, setQuery] = useState("");
  const [searchMode, setSearchMode] = useState<SearchMode>("word");
  const [showFilters, setShowFilters] = useState(false);
  const [activeCollection, setActiveCollection] = useState<string | null>(null);
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [activeGrade, setActiveGrade] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState(21);
  const [fullText, setFullText] = useState(true);
  const [showTranslation, setShowTranslation] = useState(true);
  const [page, setPage] = useState(1);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const terms = useMemo(() => foldQuery(query), [query]);

  const collections = useMemo(() => {
    const counts = new Map<string, number>();
    for (const h of HADITHS) counts.set(h.collection, (counts.get(h.collection) ?? 0) + 1);
    return [...counts.entries()].sort(([a], [b]) => a.localeCompare(b, "km"));
  }, []);

  const topics = useMemo(
    () => [...new Set(HADITHS.map((h) => h.topic))].sort((a, b) => a.localeCompare(b, "km")),
    [],
  );

  /** Everything except the grade tabs — the tabs count within this set. */
  const scoped = useMemo(
    () =>
      HADITHS.filter(
        (h) =>
          matches(h, terms, searchMode) &&
          (!activeCollection || h.collection === activeCollection) &&
          (!activeTopic || h.topic === activeTopic),
      ),
    [terms, searchMode, activeCollection, activeTopic],
  );

  const gradeTabs = useMemo(() => {
    const counts = new Map<string, number>();
    for (const h of scoped) counts.set(h.grade, (counts.get(h.grade) ?? 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [scoped]);

  const results = useMemo(
    () => scoped.filter((h) => !activeGrade || h.grade === activeGrade),
    [scoped, activeGrade],
  );

  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = results.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const update = <T,>(setter: (value: T) => void) => (value: T) => {
    setter(value);
    setPage(1);
  };

  const setQueryReset = update(setQuery);
  const setModeReset = update<SearchMode>(setSearchMode);
  const setCollectionReset = update<string | null>(setActiveCollection);
  const setTopicReset = update<string | null>(setActiveTopic);
  const setGradeReset = update<string | null>(setActiveGrade);

  const clearAll = () => {
    setQuery("");
    setActiveCollection(null);
    setActiveTopic(null);
    setActiveGrade(null);
    setPage(1);
  };

  const hasFilters = Boolean(query || activeCollection || activeTopic || activeGrade);

  const copyHadith = async (h: Hadith) => {
    const text = `${h.arabic}\n\n${h.translation}\n\n${h.collection} — ${h.refNumber} (${h.grade})`;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(h.id);
      setTimeout(() => setCopiedId((current) => (current === h.id ? null : current)), 1500);
    } catch {
      setCopiedId(null);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      <Breadcrumb className="mb-3">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">ទំព័រដើម</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>សព្វវចនាធិប្បាយហាទីស</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold text-amber-ink sm:text-3xl">
        សព្វវចនាធិប្បាយហាទីស
      </h1>

      {/* Reading toolbar */}
      <div className="mt-4 flex flex-wrap items-center gap-2 rounded-2xl border border-surface-border bg-surface-soft px-3 py-2.5 sm:gap-3 sm:px-4">
        <button
          type="button"
          onClick={() => setFullText((v) => !v)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
            fullText
              ? "bg-badge-green text-badge-green-foreground shadow-sm"
              : "border border-surface-border text-ink-muted hover:text-amber-ink"
          }`}
        >
          ហាទីសពេញលេញ
        </button>

        <div className="flex items-center gap-1 rounded-full border border-surface-border px-1.5 py-1">
          <button
            type="button"
            onClick={() => setFontSize((s) => Math.min(MAX_FONT, s + 2))}
            aria-label="ពង្រីកអក្សរ"
            className="flex size-6 items-center justify-center rounded-full text-ink-muted transition hover:bg-surface hover:text-amber-ink"
          >
            <Plus className="size-3.5" />
          </button>
          <span className="font-arabic px-1 text-sm text-ink-muted">أ</span>
          <button
            type="button"
            onClick={() => setFontSize((s) => Math.max(MIN_FONT, s - 2))}
            aria-label="បង្រួមអក្សរ"
            className="flex size-6 items-center justify-center rounded-full text-ink-muted transition hover:bg-surface hover:text-amber-ink"
          >
            <Minus className="size-3.5" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => setShowTranslation((v) => !v)}
          className="rounded-full border border-surface-border px-4 py-1.5 text-sm text-ink-muted transition hover:border-amber/40 hover:text-amber-ink"
        >
          {showTranslation ? "លាក់ការបកប្រែ" : "បង្ហាញការបកប្រែ"}
        </button>
      </div>

      {/* Search */}
      <div className="mt-5 flex items-start gap-2">
        <button
          type="button"
          onClick={() => setShowFilters((v) => !v)}
          aria-label="តម្រងលទ្ធផល"
          className={`flex size-12 shrink-0 items-center justify-center rounded-2xl border transition ${
            showFilters
              ? "border-amber/50 bg-peach text-amber-ink"
              : "border-surface-border bg-surface-soft text-ink-muted hover:text-amber-ink"
          }`}
        >
          <SlidersHorizontal className="size-4" />
        </button>

        <div className="group relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-ink-muted transition-colors group-focus-within:text-amber-ink" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQueryReset(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && setQueryReset("")}
            placeholder="ស្វែងរកក្នុងសព្វវចនាធិប្បាយដោយពាក្យណាមួយ..."
            className="h-12 w-full rounded-2xl border border-surface-border bg-surface-soft pr-11 pl-11 leading-relaxed text-ink shadow-sm outline-none transition-all placeholder:text-ink-muted/60 hover:border-amber/40 focus:border-amber/60 focus:bg-background focus:shadow-md focus:ring-4 focus:ring-amber/10 [&::-webkit-search-cancel-button]:hidden"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQueryReset("")}
              aria-label="សម្អាតការស្វែងរក"
              className="absolute top-1/2 right-3 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-surface hover:text-amber-ink"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
        {SEARCH_MODES.map((mode) => (
          <label
            key={mode.value}
            className="flex cursor-pointer items-center gap-2 text-sm text-ink-muted"
          >
            <input
              type="radio"
              name="hadith-search-mode"
              checked={searchMode === mode.value}
              onChange={() => setModeReset(mode.value)}
              className="peer sr-only"
            />
            <span className="size-4 shrink-0 rounded-full border-2 border-surface-border bg-background transition peer-checked:border-5 peer-checked:border-amber" />
            <span className="peer-checked:font-medium peer-checked:text-amber-ink">
              {mode.label}
            </span>
          </label>
        ))}

        {hasFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="ml-auto flex items-center gap-1 text-sm text-ink-muted underline-offset-4 transition hover:text-amber-ink hover:underline"
          >
            <X className="size-3.5" />
            សម្អាតទាំងអស់
          </button>
        )}
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="mt-4 rounded-2xl border border-surface-border bg-surface-soft p-4 sm:p-5">
          <p className="flex items-center gap-2 text-sm font-medium text-amber-ink">
            <ListFilter className="size-4" />
            តម្រងលទ្ធផលតាមផ្នែក
          </p>

          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold tracking-wide text-ink-muted">
                ប្រភពហាទីស
              </p>
              <div className="mt-2 flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => setCollectionReset(null)}
                  className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-sm transition ${
                    activeCollection
                      ? "text-ink-muted hover:bg-surface"
                      : "bg-badge-green font-medium text-badge-green-foreground"
                  }`}
                >
                  <span>ប្រភពទាំងអស់</span>
                  <span className="text-xs opacity-70">{HADITHS.length}</span>
                </button>
                {collections.map(([name, count]) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() =>
                      setCollectionReset(activeCollection === name ? null : name)
                    }
                    className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-sm transition ${
                      activeCollection === name
                        ? "bg-badge-green font-medium text-badge-green-foreground"
                        : "text-ink-muted hover:bg-surface"
                    }`}
                  >
                    <span className="truncate">{name}</span>
                    <span className="text-xs opacity-70">{count}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold tracking-wide text-ink-muted">
                ចំណាត់ថ្នាក់ប្រធានបទ
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {topics.map((topic) => (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => setTopicReset(activeTopic === topic ? null : topic)}
                    className={`rounded-md border px-2.5 py-1 text-xs transition ${
                      activeTopic === topic
                        ? "border-amber bg-peach font-medium text-amber-ink"
                        : "border-surface-border text-ink-muted hover:border-amber/40 hover:text-amber-ink"
                    }`}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      <h2 className="mt-7 text-xl font-bold text-ink">លទ្ធផលស្វែងរក</h2>

      <div className="mt-3 flex flex-wrap gap-1 border-b border-surface-border">
        <button
          type="button"
          onClick={() => setGradeReset(null)}
          className={`rounded-t-xl px-4 py-2 text-sm transition ${
            activeGrade
              ? "text-ink-muted hover:text-amber-ink"
              : "border border-b-0 border-surface-border bg-surface-soft font-medium text-amber-ink"
          }`}
        >
          ទាំងអស់ ({scoped.length})
        </button>
        {gradeTabs.map(([grade, count]) => (
          <button
            key={grade}
            type="button"
            onClick={() => setGradeReset(activeGrade === grade ? null : grade)}
            className={`rounded-t-xl px-4 py-2 text-sm transition ${
              activeGrade === grade
                ? "border border-b-0 border-surface-border bg-surface-soft font-medium text-amber-ink"
                : "text-ink-muted hover:text-amber-ink"
            }`}
          >
            {grade} ({count})
          </button>
        ))}
      </div>

      <div className="rounded-b-2xl border border-t-0 border-surface-border bg-surface-soft px-4 sm:px-6">
        {pageItems.map((h, index) => {
          const position = (currentPage - 1) * PAGE_SIZE + index + 1;
          return (
            <article
              key={h.id}
              className="border-b border-surface-border/70 py-6 last:border-b-0"
            >
              <p
                dir="rtl"
                lang="ar"
                style={{ fontSize: `${fontSize}px` }}
                className={`font-arabic leading-loose text-ink ${
                  fullText ? "" : "line-clamp-2"
                }`}
              >
                <span className="text-ink-muted">{position} - </span>
                <Highlighted text={h.arabic} terms={searchMode === "word" ? terms : []} />
              </p>

              {showTranslation && (
                <p
                  className={`mt-3 leading-relaxed text-ink-muted ${
                    fullText ? "" : "line-clamp-2"
                  }`}
                >
                  <Highlighted
                    text={h.translation}
                    terms={searchMode === "word" ? terms : []}
                  />
                </p>
              )}

              <p
                className={`mt-3 inline-block rounded-md px-3 py-1 text-sm font-medium ${gradeTone(
                  h.grade,
                )}`}
              >
                សេចក្តីសង្ខេបនៃការវិនិច្ឆ័យ : {h.grade}
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink">
                <span>
                  <span className="text-ink-muted">អ្នករាយការណ៍ :</span> {h.narrator}
                </span>
                <span className="text-surface-border">|</span>
                <span>
                  <span className="text-ink-muted">ប្រភព :</span> {h.collection}
                </span>
                <span className="text-surface-border">|</span>
                <span>
                  <span className="text-ink-muted">សៀវភៅ :</span> {h.book}
                </span>
              </div>

              <p className="mt-1 text-sm text-ink">
                <span className="text-ink-muted">ទំព័រ ឬ លេខ :</span> {h.refNumber}
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                <span className="text-ink-muted">ចំណាត់ថ្នាក់ប្រធានបទ :</span>
                <button
                  type="button"
                  onClick={() => setTopicReset(activeTopic === h.topic ? null : h.topic)}
                  className="rounded-md border border-badge-green-foreground/30 bg-badge-green px-2.5 py-0.5 text-xs text-badge-green-foreground transition hover:border-amber/50 hover:text-amber-ink"
                >
                  {h.topic}
                </button>
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => copyHadith(h)}
                  aria-label="ចម្លងហាទីស"
                  className="flex size-9 items-center justify-center rounded-lg border border-surface-border text-ink-muted transition hover:border-amber/50 hover:text-amber-ink"
                >
                  {copiedId === h.id ? (
                    <Check className="size-4 text-amber-ink" />
                  ) : (
                    <Copy className="size-4" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setCollectionReset(
                      activeCollection === h.collection ? null : h.collection,
                    )
                  }
                  aria-label="ហាទីសស្រដៀងគ្នា"
                  className="flex size-9 items-center justify-center rounded-lg border border-surface-border text-ink-muted transition hover:border-amber/50 hover:text-amber-ink"
                >
                  <ListFilter className="size-4" />
                </button>
              </div>
            </article>
          );
        })}

        {results.length === 0 && (
          <p className="py-12 text-center text-sm text-ink-muted">
            គ្មានលទ្ធផលត្រូវនឹងការស្វែងរកនេះទេ
          </p>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-5 flex items-center justify-center gap-1.5">
          <button
            type="button"
            onClick={() => setPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            aria-label="ទំព័រមុន"
            className="flex size-9 items-center justify-center rounded-lg border border-surface-border text-ink-muted transition hover:border-amber/50 hover:text-amber-ink disabled:opacity-40 disabled:hover:border-surface-border disabled:hover:text-ink-muted"
          >
            <ChevronLeft className="size-4" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
            <button
              key={number}
              type="button"
              onClick={() => setPage(number)}
              className={`size-9 rounded-lg border text-sm transition ${
                number === currentPage
                  ? "border-amber bg-peach font-medium text-amber-ink"
                  : "border-surface-border text-ink-muted hover:border-amber/50 hover:text-amber-ink"
              }`}
            >
              {number}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            aria-label="ទំព័របន្ទាប់"
            className="flex size-9 items-center justify-center rounded-lg border border-surface-border text-ink-muted transition hover:border-amber/50 hover:text-amber-ink disabled:opacity-40 disabled:hover:border-surface-border disabled:hover:text-ink-muted"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
}
