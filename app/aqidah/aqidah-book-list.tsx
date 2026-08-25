"use client";

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import AqidahBookCard from "./aqidah-book-card";
import { AQIDAH_BOOKS } from "@/lib/aqidah-data";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/app/ui/breadcrumb";

export default function AqidahBookList() {
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const filteredBooks = q
    ? AQIDAH_BOOKS.filter(
        (book) =>
          book.khmer_title.toLowerCase().includes(q) ||
          book.arabic_title.includes(query.trim()),
      )
    : AQIDAH_BOOKS;

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
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

      <h1 className="mb-5 text-2xl font-bold text-ink sm:text-3xl">
        សៀវភៅទាំងអស់
      </h1>

      <div className="relative mb-6">
        <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-ink-muted" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ស្វែងរកមេរៀន ឬ តំណាង..."
          className="w-full rounded-full border border-surface-border bg-surface-soft py-2.5 pr-4 pl-10 text-sm text-ink outline-none focus:border-amber"
        />
      </div>

      <div className="grid gap-3.5">
        {filteredBooks.map((book, i) => (
          <AqidahBookCard key={book.id} book={book} index={i} />
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
