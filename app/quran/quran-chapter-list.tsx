"use client";

import { useState } from "react";
import ChapterCard from "../components/features/category/ChapterCard";
import { Chapter } from "@/lib/getChapters";

interface QuranChapterListProps {
  chapters: Chapter[];
}

export default function QuranChapterList({ chapters }: QuranChapterListProps) {
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const filteredChapters = q
    ? chapters.filter(
        (chapter) =>
          chapter.name_simple.toLowerCase().includes(q) ||
          chapter.translated_name.name.toLowerCase().includes(q) ||
          String(chapter.id) === q,
      )
    : chapters;

  return (
    <div className="mt-4">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="ស្វែងរកឈ្មោះ ឬលេខជំពូក"
        className="w-full max-w-xs rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-[#00966b] sm:w-72"
      />

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filteredChapters.map((chapter) => (
          <ChapterCard key={chapter.id} chapter={chapter} />
        ))}
      </div>

      {filteredChapters.length === 0 && (
        <p className="py-10 text-center text-sm text-slate-500">
          គ្មានជំពូកត្រូវនឹង &quot;{query}&quot; ទេ
        </p>
      )}
    </div>
  );
}
