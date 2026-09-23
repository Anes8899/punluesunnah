"use client";

// Loads the per-page QCF V4 Tajweed glyph fonts and their color palettes on
// demand, following https://api-docs.quran.foundation/docs/tutorials/fonts/font-rendering/#tajweed-color-themes
//
// Chrome/Safari/Edge render colors via the COLRv1 font + CSS `font-palette`.
// Firefox doesn't support `font-palette` yet, so it loads a theme variant
// (ot-svg) that has the colors baked into the glyphs directly.

const FONT_BASE = "https://verses.quran.foundation/fonts/quran/hafs/v4";
export const TAJWEED_PALETTE = "--TajweedLight";

const loadedFonts = new Map<number, Promise<void>>();
let paletteStyleEl: HTMLStyleElement | null = null;
const palettedPages = new Set<number>();

function isFirefox() {
  return typeof navigator !== "undefined" && /firefox/i.test(navigator.userAgent);
}

export function getTajweedFontFamily(page: number): string {
  return `tajweed-p${page}`;
}

export function getTajweedPaletteName(): string | undefined {
  return isFirefox() ? undefined : TAJWEED_PALETTE;
}

function getPaletteStyleEl(): HTMLStyleElement {
  if (paletteStyleEl) return paletteStyleEl;
  paletteStyleEl = document.createElement("style");
  paletteStyleEl.id = "tajweed-font-palettes";
  document.head.appendChild(paletteStyleEl);
  return paletteStyleEl;
}

export function ensureTajweedFont(page: number): Promise<void> {
  const cached = loadedFonts.get(page);
  if (cached) return cached;

  const family = getTajweedFontFamily(page);
  const url = isFirefox()
    ? `${FONT_BASE}/ot-svg/light/woff2/p${page}.woff2`
    : `${FONT_BASE}/colrv1/woff2/p${page}.woff2`;

  const promise = (async () => {
    const face = new FontFace(family, `url(${url})`, { display: "block" });
    await face.load();
    document.fonts.add(face);

    if (!isFirefox() && !palettedPages.has(page)) {
      palettedPages.add(page);
      getPaletteStyleEl().appendChild(
        document.createTextNode(
          `@font-palette-values ${TAJWEED_PALETTE} { font-family: '${family}'; base-palette: 0; }\n`,
        ),
      );
    }
  })().catch((error) => {
    loadedFonts.delete(page);
    throw error;
  });

  loadedFonts.set(page, promise);
  return promise;
}
