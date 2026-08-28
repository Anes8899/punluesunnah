"use client";

import { useEffect, useState, type CSSProperties } from "react";
import {
  ensureTajweedFont,
  getTajweedFontFamily,
  getTajweedPaletteName,
} from "@/lib/tajweedFont";
import type { MushafLine } from "@/lib/mushafLines";
import AyahMarker from "./AyahMarker";

interface MushafPageProps {
  lines: MushafLine[];
  centeredVerseRange?: [number, number];
}

export default function MushafPage({
  lines,
  centeredVerseRange,
}: MushafPageProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const pages = Array.from(new Set(lines.map((line) => line.page_number)));
    let cancelled = false;

    Promise.all(pages.map((page) => ensureTajweedFont(page))).then(() => {
      if (!cancelled) setReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, [lines]);

  if (!ready) {
    return (
      <>
        {lines.map((line) => (
          <div key={line.key} className="h-10 md:h-14" />
        ))}
      </>
    );
  }

  return (
    <>
      {lines.map((line) => {
        const centered =
          centeredVerseRange !== undefined &&
          line.words.every(
            (word) =>
              word.verse_number >= centeredVerseRange[0] &&
              word.verse_number <= centeredVerseRange[1],
          );

        return (
          <div
            key={line.key}
            dir="rtl"
            className={`font-arabic flex w-fit flex-nowrap items-baseline gap-x-1 mx-auto text-2xl leading-loose text-ink md:text-4xl ${
              centered ? "justify-center" : "justify-start"
            }`}
          >
            {line.words.map((word, index) =>
              word.char_type_name === "end" ? (
                <AyahMarker key={index} number={word.verse_number} />
              ) : (
                <span
                  key={index}
                  style={
                    {
                      fontFamily: getTajweedFontFamily(line.page_number),
                      fontPalette: getTajweedPaletteName(),
                    } as CSSProperties
                  }
                  dangerouslySetInnerHTML={{ __html: word.code_v2 }}
                />
              ),
            )}
          </div>
        );
      })}
    </>
  );
}
