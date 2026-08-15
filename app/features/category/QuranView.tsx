"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Info,
  Play,
  Rows3,
  Type,
} from "lucide-react";
import { Button } from "../../ui/button";
import { ToggleGroup, ToggleGroupItem } from "../../ui/toggle-group";
import type { Chapter } from "@/lib/getChapters";
import type { Verse } from "@/lib/getVerses";
import type { MushafLine } from "@/lib/mushafLines";
import MushafPage from "./MushafPage";
import VerseByVerse from "./VerseByVerse";

interface QuranViewProps {
  chapter: Chapter;
  lines: MushafLine[];
  verses: Verse[];
  pageNumber: number;
  juzNumber: number;
  hizbNumber: number;
  prevId: number | null;
  nextId: number | null;
  centeredVerseRange?: [number, number];
}

export default function QuranView({
  chapter,
  lines,
  verses,
  pageNumber,
  juzNumber,
  hizbNumber,
  prevId,
  nextId,
  centeredVerseRange,
}: QuranViewProps) {
  const [mode, setMode] = useState<"arabic" | "verse-by-verse">("arabic");

  return (
    <>
      <div className="mx-auto max-w-3xl px-4">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-full bg-[#faf1e4] px-4 py-2 text-sm">
          <div className="flex items-center gap-2 text-slate-600">
            <Bookmark className="size-4" />
            <span className="font-medium text-slate-700">
              Page {pageNumber}
            </span>
            <span className="text-slate-300">/</span>
            <span>
              Juz {juzNumber} / Hizb {hizbNumber}
            </span>
          </div>
          <ToggleGroup
            type="single"
            value={mode}
            onValueChange={(value) => {
              if (value) setMode(value as typeof mode);
            }}
            className="rounded-full bg-white px-1.5 py-1 text-slate-600"
          >
            <ToggleGroupItem
              value="verse-by-verse"
              className="gap-1.5 rounded-full px-2.5 py-1 font-medium data-[state=on]:bg-transparent data-[state=on]:text-slate-600"
            >
              <Rows3 className="size-4" />
              Verse by Verse
            </ToggleGroupItem>
            <ToggleGroupItem
              value="arabic"
              className="gap-1.5 rounded-full px-2.5 py-1 font-medium data-[state=on]:bg-[#8a5a2e] data-[state=on]:text-white"
            >
              <Type className="size-4" />
              Arabic
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      <div className="mx-auto mt-6 max-w-3xl px-4">
        <div className="rounded-2xl bg-[#faf1e4] p-4">
          <div className="flex items-center gap-4">
            <p className="font-arabic shrink-0 text-4xl text-slate-800">
              {chapter.name_arabic}
            </p>
            <div>
              <h2 className="text-lg font-semibold text-slate-800">
                {chapter.id}. Surah {chapter.name_simple}
              </h2>
              <p className="text-sm font-medium text-[#00966b]">
                {chapter.translated_name.name}
              </p>
            </div>
          </div>
          <p className="mt-3 text-sm text-slate-500">
            Read and listen to Surah {chapter.name_simple} with translation,
            tafsir, audio recitation, word-by-word meaning, and transliteration.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700"
            >
              <Play className="size-3.5 fill-current" />
              Listen
            </button>
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700"
            >
              <Info className="size-3.5" />
              Info
            </button>
            <button
              type="button"
              className="rounded-full bg-slate-900 px-4 py-1.5 text-sm font-medium text-white"
            >
              Arabic
            </button>
            <button
              type="button"
              className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-medium text-slate-700"
            >
              Translation
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 w-full max-w-3xl px-4 overflow-x-auto">
        {mode === "arabic" ? (
          <div dir="rtl">
            <MushafPage lines={lines} centeredVerseRange={centeredVerseRange} />
          </div>
        ) : (
          <VerseByVerse verses={verses} />
        )}

        <div className="mt-6 flex w-full items-center justify-center gap-3">
          <div className="flex gap-2">
            {nextId ? (
              <Button asChild variant="outline" size="icon">
                <Link href={`/quran/${nextId}`} aria-label="ជំពូកបន្ទាប់">
                  <ChevronRight />
                </Link>
              </Button>
            ) : (
              <Button variant="outline" size="icon" disabled>
                <ChevronRight />
              </Button>
            )}
            {prevId ? (
              <Button asChild variant="outline" size="icon">
                <Link href={`/quran/${prevId}`} aria-label="ជំពូកមុន">
                  <ChevronLeft />
                </Link>
              </Button>
            ) : (
              <Button variant="outline" size="icon" disabled>
                <ChevronLeft />
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
