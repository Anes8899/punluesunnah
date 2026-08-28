"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import BookCard from "@/app/components/BookCard";
import { TAZKIYAH_TOPICS } from "./tazkiyahData";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/app/ui/breadcrumb";

export default function TazkiyahLibrary() {
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const filteredTopics = q
    ? TAZKIYAH_TOPICS.filter(
        (topic) =>
          topic.title.toLowerCase().includes(q) ||
          topic.kicker.toLowerCase().includes(q) ||
          topic.short.toLowerCase().includes(q) ||
          topic.arabic.includes(query.trim()),
      )
    : TAZKIYAH_TOPICS;

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
            <BreadcrumbPage>ប្រធានបទទាំងអស់</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <p className="font-arabic text-center text-3xl text-amber-ink">التَّزْكِيَة</p>

      <div className="mt-1 mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <h1 className="text-2xl font-bold text-ink sm:text-3xl">
          ភាពស្រស់ស្រាយចិត្ត ក្នុងគន្លងឥស្លាម
        </h1>

        <div className="group relative w-full sm:w-72 md:w-80">
          <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-ink-muted transition-colors group-focus-within:text-amber-ink" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && setQuery("")}
            placeholder="ស្វែងរកប្រធានបទ ឬ តំណាង..."
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

      <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
        {filteredTopics.map((topic) => (
          <BookCard
            key={topic.id}
            href={`/tazkiyah/${topic.id}`}
            badge={TAZKIYAH_TOPICS.indexOf(topic) + 1}
            arabicTitle={topic.arabic}
            khmerTitle={topic.title}
          />
        ))}
      </div>
      {filteredTopics.length === 0 && (
        <p className="py-10 text-center text-sm text-ink-muted">
          មិនមានលទ្ធផលទេ
        </p>
      )}
    </div>
  );
}
