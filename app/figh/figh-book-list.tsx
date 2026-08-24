"use client";

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";

interface FighSubtopic {
  id: number;
  khmer: string;
}

interface FighTopic {
  id: number;
  khmer: string;
  subtopics: FighSubtopic[];
}

interface FighSection {
  id: number;
  khmer: string;
  topics: FighTopic[];
}

interface FighBook {
  id: number;
  arabic: string;
  khmer: string;
  sections: FighSection[];
}

const ACCENTS = [
  { tint: "bg-badge-green", text: "text-badge-green-foreground" },
  { tint: "bg-peach", text: "text-amber" },
  { tint: "bg-muted", text: "text-foreground" },
];

const FIGH_BOOKS: FighBook[] = [
  {
    id: 1,
    arabic: "كَتَابُ الطَّهَارَةِ",
    khmer: "សៀវភៅស្តីពីការសម្អាត",
    sections: [
      {
        id: 1,
        khmer: "ជំពូកទឹក និងវូឌុក",
        topics: [
          {
            id: 1,
            khmer: "អ្វីដែលធ្វើឲ្យវូឌុករលាយ",
            subtopics: [
              { id: 1, khmer: "ការនោម និងលាមក" },
              { id: 2, khmer: "ដេកលក់ស្កប់ស្កល់" },
            ],
          },
          {
            id: 2,
            khmer: "របៀបធ្វើវូឌុក",
            subtopics: [
              { id: 1, khmer: "ការលាងមុខ ដៃ និងជើង" },
              { id: 2, khmer: "ការជូតក្បាល" },
            ],
          },
        ],
      },
      {
        id: 2,
        khmer: "ជំពូកការងូតទឹកជូនុប",
        topics: [
          {
            id: 1,
            khmer: "ករណីដែលកំណត់ឲ្យងូតទឹកជូនុប",
            subtopics: [
              { id: 1, khmer: "ការរួមភេទ" },
              { id: 2, khmer: "ការចប់រដូវ" },
            ],
          },
        ],
      },
    ],
  },
];

export default function FighBookList() {
  const [query, setQuery] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const q = query.trim().toLowerCase();
  const filteredBooks = q
    ? FIGH_BOOKS.filter(
        (book) =>
          book.khmer.toLowerCase().includes(q) ||
          book.arabic.includes(query.trim()),
      )
    : FIGH_BOOKS;

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
        {filteredBooks.map((book, i) => {
          const accent = ACCENTS[i % ACCENTS.length];
          const isOpen = expandedId === book.id;
          return (
            <Card
              key={book.id}
              onClick={() => setExpandedId(isOpen ? null : book.id)}
              className={`cursor-pointer flex-row items-stretch gap-0 overflow-hidden border-none py-0 transition hover:shadow-md ${accent.tint}/25`}
            >
              <div className={`w-1.5 shrink-0 ${accent.tint}`} />
              <CardContent className="flex flex-1 flex-col px-4 py-4">
                <div className="flex items-center gap-4">
                  <div
                    className={`flex size-8.5 shrink-0 items-center justify-center rounded-full text-sm font-bold ${accent.tint} ${accent.text}`}
                  >
                    {book.id}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p
                      className={`font-arabic truncate text-2xl ${accent.text}`}
                    >
                      {book.arabic}
                    </p>
                    <p className="mt-0.5 truncate text-base leading-relaxed text-ink-muted">
                      {book.khmer}
                    </p>
                  </div>
                </div>

                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen
                      ? "mt-3 grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="border-t border-surface-border pt-3 pl-12.5">
                      <p className={`font-arabic text-xl ${accent.text}`}>
                        {book.arabic}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-ink-muted">
                        {book.khmer}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredBooks.length === 0 && (
        <p className="py-10 text-center text-sm text-ink-muted">
          មិនមានលទ្ធផលទេ
        </p>
      )}
    </div>
  );
}
