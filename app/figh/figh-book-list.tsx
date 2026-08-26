"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import BookCard from "@/app/components/BookCard";
import { FIGH_BOOKS } from "@/lib/figh-data";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/app/ui/breadcrumb";

export default function FighBookList() {
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const filteredBooks = q
    ? FIGH_BOOKS.filter(
        (book) =>
          book.khmer_title.toLowerCase().includes(q) ||
          book.arabic_title.includes(query.trim()),
      )
    : FIGH_BOOKS;

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
            <BreadcrumbPage>សៀវភៅទាំងអស់</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <h1 className="text-2xl font-bold text-ink sm:text-3xl">
          សៀវភៅទាំងអស់
        </h1>

        <div className="group relative w-full sm:w-72 md:w-80">
          <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-ink-muted transition-colors group-focus-within:text-amber" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && setQuery("")}
            placeholder="ស្វែងរកមេរៀន ឬ តំណាង..."
            className="w-full rounded-full border border-surface-border bg-surface-soft py-3 pr-11 pl-11 leading-relaxed text-ink shadow-sm outline-none transition-all placeholder:text-ink-muted/60 hover:border-amber/40 focus:border-amber/60 focus:bg-background focus:shadow-md focus:ring-4 focus:ring-amber/10"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="សម្អាតការស្វែងរក"
              className="absolute top-1/2 right-3 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-surface hover:text-amber"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </div>

      <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
        {filteredBooks.map((book) => (
          <BookCard
            key={book.id}
            href={`/figh/${book.id}`}
            badge={book.id}
            arabicTitle={book.arabic_title}
            khmerTitle={book.khmer_title}
          />
        ))}
      </div>
      {filteredBooks.length === 0 && (
        <p className="py-10 text-center text-sm text-ink-muted">
          មិនមានលទ្ធផលទេ
        </p>
      )}
    </div>
  );
}
