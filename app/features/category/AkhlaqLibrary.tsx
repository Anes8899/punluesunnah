"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BadgeCheck,
  HeartHandshake,
  Hourglass,
  Scale,
  Search,
  ShieldCheck,
  Sprout,
  X,
  type LucideIcon,
} from "lucide-react";
import { AKHLAQ_VIRTUES } from "./akhlaqData";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/app/ui/breadcrumb";

const VIRTUE_META: Record<string, { icon: LucideIcon; gradient: string }> = {
  sidq: {
    icon: BadgeCheck,
    gradient: "from-amber via-brand-soft to-brand",
  },
  sabr: {
    icon: Hourglass,
    gradient: "from-gold via-amber to-brand",
  },
  tawadu: { icon: Sprout, gradient: "from-brand-soft via-brand-soft to-brand" },
  rahmah: {
    icon: HeartHandshake,
    gradient: "from-brand via-amber to-gold",
  },
  amanah: {
    icon: ShieldCheck,
    gradient: "from-brand-soft via-brand to-ink",
  },
  adl: { icon: Scale, gradient: "from-ink via-brand to-brand-soft" },
};

const FALLBACK_META = {
  icon: BadgeCheck,
  gradient: "from-brand via-brand-soft to-brand",
};

export default function AkhlaqLibrary() {
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const filteredVirtues = q
    ? AKHLAQ_VIRTUES.filter(
        (virtue) =>
          virtue.title.toLowerCase().includes(q) ||
          virtue.kicker.toLowerCase().includes(q) ||
          virtue.short.toLowerCase().includes(q) ||
          virtue.arabic.includes(query.trim()),
      )
    : AKHLAQ_VIRTUES;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <Breadcrumb className="mb-3">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">ទំព័រដើម</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>សីលធម៌ទាំងអស់</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <p className="font-arabic text-center text-3xl text-amber-ink">
        الأَخْلَاق
      </p>

      <div className="mt-1 mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <h1 className="text-2xl font-bold text-ink sm:text-3xl">
          សីលធម៌ក្នុងឥស្លាម
        </h1>

        <div className="group relative w-full sm:w-72 md:w-80">
          <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-ink-muted transition-colors group-focus-within:text-amber-ink" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && setQuery("")}
            placeholder="ស្វែងរកសីលធម៌ ឬ តំណាង..."
            className="w-full rounded-full border border-surface-border bg-surface-soft py-3 pr-11 pl-11 leading-relaxed text-ink shadow-sm outline-none transition-all placeholder:text-ink-muted/60 hover:border-amber/40 focus:border-amber/60 focus:bg-background focus:shadow-md focus:ring-4 focus:ring-amber/10"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="សម្អាតការស្វែងរក"
              className="absolute top-1/2 right-3 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-surface hover:text-amber-ink"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </div>

      <section className="rounded-3xl bg-surface-soft/60 p-4 sm:p-6">
        <h2 className="mb-4 text-lg font-bold text-amber-ink sm:text-xl">
          សីលធម៌សំខាន់ៗ
        </h2>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
          {filteredVirtues.map((virtue) => {
            const { icon: Icon, gradient } =
              VIRTUE_META[virtue.id] ?? FALLBACK_META;

            return (
              <Link
                key={virtue.id}
                href={`/akhlaq/${virtue.id}`}
                className="group overflow-hidden rounded-2xl bg-background text-center no-underline shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <span
                  className={`relative flex h-28 flex-col items-center justify-center gap-1 bg-linear-to-br sm:h-32 ${gradient}`}
                >
                  <Icon
                    className="size-8 text-white drop-shadow-sm transition-transform group-hover:scale-110 sm:size-9"
                    strokeWidth={1.5}
                  />
                  <span className="font-arabic text-xl text-white drop-shadow-sm sm:text-2xl">
                    {virtue.arabic}
                  </span>
                </span>
                <span className="block px-3 py-3 text-sm font-semibold text-ink sm:text-base">
                  {virtue.kicker}
                </span>
              </Link>
            );
          })}
        </div>
      </section>
      {filteredVirtues.length === 0 && (
        <p className="py-10 text-center text-sm text-ink-muted">
          មិនមានលទ្ធផលទេ
        </p>
      )}

      {/* <div className="mt-10">
        <LessonContent
          content={[
            { type: "divider", text: "ឯកសារយោង" },
            ...AKHLAQ_REFERENCES.map((r) => ({
              type: "evidence" as const,
              kind: /\d+:\d+/.test(r.source)
                ? ("quran" as const)
                : ("hadith" as const),
              arabic: r.arabic,
              source: r.source,
              translation: r.khmer.replace(/^"|"$/g, ""),
            })),
          ]}
        />
      </div> */}
    </div>
  );
}
