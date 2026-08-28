"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import DuaCard from "./DuaCard";
import { DUAS, DUA_CATEGORIES } from "./duaData";
import { getCategoryMeta } from "./duaCategoryMeta";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/app/ui/breadcrumb";

export default function DuaLibrary() {
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const matchedDuas = q
    ? DUAS.filter(
        (dua) =>
          dua.title.toLowerCase().includes(q) ||
          dua.category.toLowerCase().includes(q) ||
          dua.khmer.toLowerCase().includes(q) ||
          dua.arabic.includes(query.trim()),
      )
    : [];

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
            <BreadcrumbPage>ទូអាទាំងអស់</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <p className="font-arabic text-center text-3xl text-amber-ink">الدُّعَاء</p>

      <div className="mt-1 mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <h1 className="text-2xl font-bold text-ink sm:text-3xl">
          ទូអាប្រចាំថ្ងៃ
        </h1>

        <div className="group relative w-full sm:w-72 md:w-80">
          <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-ink-muted transition-colors group-focus-within:text-amber-ink" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && setQuery("")}
            placeholder="ស្វែងរកទូអា ឬ តំណាង..."
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

      {q ? (
        <section className="rounded-3xl bg-surface-soft/60 p-4 sm:p-6">
          <h2 className="mb-4 text-lg font-bold text-amber-ink sm:text-xl">
            លទ្ធផលស្វែងរក
          </h2>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {matchedDuas.map((dua) => (
              <DuaCard key={dua.id} dua={dua} />
            ))}
          </div>

          {matchedDuas.length === 0 && (
            <p className="py-10 text-center text-sm text-ink-muted">
              មិនមានលទ្ធផលទេ
            </p>
          )}
        </section>
      ) : (
        <section className="rounded-3xl bg-surface-soft/60 p-4 sm:p-6">
          <h2 className="mb-4 text-lg font-bold text-amber-ink sm:text-xl">
            ប្រភេទទូអា
          </h2>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
            {DUA_CATEGORIES.map((cat) => {
              const { slug, icon: Icon, gradient } = getCategoryMeta(cat);
              const count = DUAS.filter((dua) => dua.category === cat).length;

              return (
                <Link
                  key={cat}
                  href={`/dua/category/${slug}`}
                  className="group overflow-hidden rounded-2xl bg-background text-center no-underline shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <span
                    className={`flex h-24 items-center justify-center bg-linear-to-br sm:h-28 ${gradient}`}
                  >
                    <Icon
                      className="size-9 text-white drop-shadow-sm transition-transform group-hover:scale-110 sm:size-10"
                      strokeWidth={1.5}
                    />
                  </span>
                  <span className="block px-2 pt-3 text-sm font-semibold text-ink">
                    {cat}
                  </span>
                  <span className="block px-2 pb-3 text-xs text-ink-muted">
                    {count} ទូអា
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
