"use client";

import { useMemo, useState } from "react";
import { DUAS, DUA_CATEGORIES } from "./duaData";

export default function DuaLibrary() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      activeCategory
        ? DUAS.filter((d) => d.category === activeCategory)
        : DUAS,
    [activeCategory],
  );

  return (
    <div className="mx-auto max-w-4xl">
      <header className="rounded-lg bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
            ទូអាប្រចាំថ្ងៃ
          </h1>
          <span className="inline-flex items-center rounded-full bg-[#00966b]/10 px-3 py-1 text-xs font-medium text-[#00966b]">
            {filtered.length} នៃ {DUAS.length}
          </span>
        </div>
        <p className="mt-2 max-w-[70ch] text-sm text-slate-500">
          ទូអាភាសាអារ៉ាប់ ព្រមទាំងអត្ថន័យ និងសម្រង់ជាភាសាខ្មែរ។
        </p>
      </header>

      <div className="mt-6 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory(null)}
          className={`rounded-full px-3 py-1 text-xs font-medium transition ${
            !activeCategory
              ? "bg-[#00966b] text-white"
              : "border border-[#00966b] text-[#00966b] hover:bg-[#00966b]/5"
          }`}
        >
          ទាំងអស់
        </button>
        {DUA_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() =>
              setActiveCategory((current) => (current === cat ? null : cat))
            }
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              activeCategory === cat
                ? "bg-[#00966b] text-white"
                : "border border-[#00966b] text-[#00966b] hover:bg-[#00966b]/5"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {filtered.map((dua) => (
          <div
            key={dua.id}
            className="rounded-lg bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex items-center rounded-full bg-[#00966b]/10 px-3 py-1 text-xs font-medium text-[#00966b]">
                {dua.category}
              </span>
              <span className="text-xs text-slate-400">{dua.reference}</span>
            </div>

            <h2 className="mt-3 text-base font-semibold text-slate-800">
              {dua.title}
            </h2>

            <p className="font-arabic mt-4 text-right text-2xl leading-relaxed text-slate-800">
              {dua.arabic}
            </p>

            <p className="mt-4 text-sm leading-6 text-slate-600">
              {dua.khmer}
            </p>
          </div>
        ))}

        {filtered.length === 0 && (
          <p className="rounded-lg bg-white py-8 text-center text-sm text-slate-500 shadow-sm">
            គ្មានទូអាត្រូវនឹងលក្ខខណ្ឌនេះទេ
          </p>
        )}
      </div>
    </div>
  );
}
