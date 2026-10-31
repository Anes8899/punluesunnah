// Fills in letters a PDF's ToUnicode map leaves out. Chromium (Skia) PDFs only map a font's isolated letter
// forms, so joined forms (the ص in الأصل, the ف in في ...) extract as \0. Each unmapped glyph is matched
// by outline against a full copy of the same font in assets/fonts, whose cmap + GSUB say which letters it draws.
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import { decodePDFRawStream, PDFArray, PDFDict, PDFDocument, PDFName, PDFRawStream, PDFRef, type PDFObject } from "pdf-lib";

const fontsDir = path.resolve(process.env.FONTS_DIR ?? "assets/fonts");

// ---- TrueType tables -------------------------------------------------------------------------------

const tableOffsets = (ttf: Buffer) => {
  const tables: Record<string, number> = {};
  for (let i = 0; i < ttf.readUInt16BE(4); i++) tables[ttf.toString("latin1", 12 + i * 16, 16 + i * 16)] = ttf.readUInt32BE(20 + i * 16);
  return tables;
};

// Fingerprint of each glyph's outline, ignoring hinting, point-data packing and glyph numbering.
const outlineKeys = (ttf: Buffer): string[] => {
  const t = tableOffsets(ttf);
  const count = ttf.readUInt16BE(t.maxp + 4);
  const longLoca = ttf.readInt16BE(t.head + 50) === 1;
  const loca = (g: number) => (longLoca ? ttf.readUInt32BE(t.loca + g * 4) : ttf.readUInt16BE(t.loca + g * 2) * 2);
  const keys = new Map<number, string>();
  const key = (gid: number): string => {
    const known = keys.get(gid);
    if (known !== undefined) return known;
    const d = ttf.subarray(t.glyf + loca(gid), t.glyf + loca(gid + 1));
    const hash = createHash("sha1");
    if (!d.length) {
      keys.set(gid, "");
      return "";
    }
    const contours = d.readInt16BE(0);
    if (contours >= 0) {
      const ends = Array.from({ length: contours }, (_, i) => d.readUInt16BE(10 + i * 2));
      const points = contours ? ends[contours - 1] + 1 : 0;
      let p = 12 + contours * 2 + d.readUInt16BE(10 + contours * 2);
      const flags: number[] = [];
      while (flags.length < points) {
        const f = d[p++];
        flags.push(f);
        if (f & 8) for (let r = d[p++]; r > 0; r--) flags.push(f);
      }
      const coords = (short: number, same: number) => {
        let v = 0;
        return flags.map((f) => {
          if (f & short) v += f & same ? d[p++] : -d[p++];
          else if (!(f & same)) (v += d.readInt16BE(p)), (p += 2);
          return v;
        });
      };
      const xs = coords(2, 16);
      const ys = coords(4, 32);
      hash.update(`${ends}|${flags.map((f, i) => `${f & 1}:${xs[i]}:${ys[i]}`).join(" ")}`);
    } else {
      for (let p = 10; ; ) {
        const f = d.readUInt16BE(p);
        const len = 4 + (f & 1 ? 4 : 2) + (f & 8 ? 2 : f & 0x40 ? 4 : f & 0x80 ? 8 : 0);
        hash.update(`${f & 0xff07}:${key(d.readUInt16BE(p + 2))}:`).update(d.subarray(p + 4, p + len));
        p += len;
        if (!(f & 0x20)) break;
      }
    }
    keys.set(gid, hash.digest("hex"));
    return keys.get(gid)!;
  };
  return Array.from({ length: count }, (_, gid) => key(gid));
};

const coverage = (b: Buffer, o: number): number[] => {
  const out: number[] = [];
  const n = b.readUInt16BE(o + 2);
  for (let i = 0; i < n; i++) {
    if (b.readUInt16BE(o) === 1) out.push(b.readUInt16BE(o + 4 + i * 2));
    else for (let g = b.readUInt16BE(o + 4 + i * 6); g <= b.readUInt16BE(o + 6 + i * 6); g++) out.push(g);
  }
  return out;
};

// Text each glyph draws: from the cmap, then through GSUB single, multiple, alternate and ligature
// substitutions until no new glyph is reached. Contextual lookups only pick among these.
const glyphTexts = (b: Buffer): Map<number, string> => {
  const t = tableOffsets(b);
  const texts = new Map<number, string>();
  for (let i = 0; i < b.readUInt16BE(t.cmap + 2); i++) {
    const p = t.cmap + b.readUInt32BE(t.cmap + 8 + i * 8);
    if (b.readUInt16BE(p) !== 4) continue;
    const segX2 = b.readUInt16BE(p + 6);
    for (let k = 0; k < segX2 / 2; k++) {
      const end = b.readUInt16BE(p + 14 + k * 2);
      const start = b.readUInt16BE(p + 16 + segX2 + k * 2);
      const delta = b.readInt16BE(p + 16 + 2 * segX2 + k * 2);
      const rangeAt = p + 16 + 3 * segX2 + k * 2;
      const range = b.readUInt16BE(rangeAt);
      for (let u = start; u <= end && u !== 0xffff; u++) {
        let gid = range ? b.readUInt16BE(rangeAt + range + (u - start) * 2) : u;
        if (gid) gid = (gid + delta) & 0xffff;
        if (gid && !texts.has(gid)) texts.set(gid, String.fromCodePoint(u));
      }
    }
  }
  const lookups = t.GSUB + b.readUInt16BE(t.GSUB + 8);
  const subtables: [number, number][] = [];
  for (let i = 0; i < b.readUInt16BE(lookups); i++) {
    const l = lookups + b.readUInt16BE(lookups + 2 + i * 2);
    for (let j = 0; j < b.readUInt16BE(l + 4); j++) {
      let type = b.readUInt16BE(l);
      let st = l + b.readUInt16BE(l + 6 + j * 2);
      if (type === 7) (type = b.readUInt16BE(st + 2)), (st += b.readUInt32BE(st + 4));
      if (type <= 4) subtables.push([type, st]);
    }
  }
  for (let changed = true; changed; ) {
    changed = false;
    const reach = (gid: number, text: string | undefined) => {
      if (text !== undefined && !texts.has(gid)) texts.set(gid, text), (changed = true);
    };
    for (const [type, st] of subtables) {
      const format = b.readUInt16BE(st);
      coverage(b, st + b.readUInt16BE(st + 2)).forEach((gid, i) => {
        const text = texts.get(gid);
        const at = st + b.readUInt16BE(st + 6 + i * 2);
        if (type === 1) reach(format === 1 ? (gid + b.readInt16BE(st + 4)) & 0xffff : b.readUInt16BE(st + 6 + i * 2), text);
        if (type === 2 && b.readUInt16BE(at) === 1) reach(b.readUInt16BE(at + 2), text);
        if (type === 3) for (let k = 0; k < b.readUInt16BE(at); k++) reach(b.readUInt16BE(at + 2 + k * 2), text);
        if (type === 4)
          for (let k = 0; k < b.readUInt16BE(at); k++) {
            const lig = at + b.readUInt16BE(at + 2 + k * 2);
            const parts = [text];
            for (let q = 1; q < b.readUInt16BE(lig + 2); q++) parts.push(texts.get(b.readUInt16BE(lig + 2 + q * 2)));
            if (parts.every((part) => part !== undefined)) reach(b.readUInt16BE(lig), parts.join(""));
          }
      });
    }
  }
  return texts;
};

// ---- Reference fonts -------------------------------------------------------------------------------

// Letters the font itself would use, preferred over look-alikes (ہ for ه, ی for ي ...).
const plainText = /^[ -~ء-ٟ٠-٩ٰ]+$/u;

// Outline fingerprint -> text for the font named `name` (e.g. "Amiri-Regular"), or null if not bundled.
const references = new Map<string, Map<string, string> | null>();
const referenceFor = (name: string): Map<string, string> | null => {
  if (references.has(name)) return references.get(name)!;
  let reference: Map<string, string> | null = null;
  try {
    const ttf = readFileSync(path.join(fontsDir, `${path.basename(name)}.ttf`));
    const texts = glyphTexts(ttf);
    const candidates = new Map<string, Set<string>>();
    outlineKeys(ttf).forEach((key, gid) => {
      const text = texts.get(gid)?.normalize("NFKC");
      if (key && text) (candidates.get(key) ?? candidates.set(key, new Set()).get(key)!).add(text);
    });
    reference = new Map();
    for (const [key, set] of candidates) {
      const plain = [...set].filter((text) => plainText.test(text));
      const options = plain.length ? plain : [...set];
      // Same outline drawn for different letters: there is no telling which one the PDF meant.
      if (options.length === 1) reference.set(key, options[0]);
    }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
  references.set(name, reference);
  return reference;
};

// ---- PDF -------------------------------------------------------------------------------------------

const hex = (s: string, digits: number) => s.toUpperCase().padStart(digits, "0");
const utf16Hex = (text: string) => [...Buffer.from(text, "utf16le").swap16()].map((byte) => hex(byte.toString(16), 2)).join("");

const fromUtf16Hex = (h: string) => Buffer.from(h, "hex").swap16().toString("utf16le");

// CID -> text of a ToUnicode CMap. Skia maps the glyphs it can't name to U+0000; those are left out.
const parseToUnicode = (cmap: string): Map<number, string> => {
  const texts = new Map<number, string>();
  const set = (cid: number, h: string) => {
    if (h.length % 4 === 0 && !/^(0000)+$/.test(h)) texts.set(cid, fromUtf16Hex(h));
  };
  for (const block of cmap.matchAll(/beginbfchar([\s\S]*?)endbfchar/g))
    for (const [, cid, h] of block[1].matchAll(/<([0-9a-f]+)>\s*<([0-9a-f]*)>/gi)) set(parseInt(cid, 16), h);
  for (const block of cmap.matchAll(/beginbfrange([\s\S]*?)endbfrange/g))
    for (const [, from, to, start, list] of block[1].matchAll(/<([0-9a-f]+)>\s*<([0-9a-f]+)>\s*(?:<([0-9a-f]*)>|\[([^\]]*)\])/gi)) {
      const items = list?.match(/[0-9a-f]+/gi);
      for (let cid = parseInt(from, 16), i = 0; cid <= parseInt(to, 16); cid++, i++) {
        if (items) set(cid, items[i] ?? "");
        // Ranges count up in the last UTF-16 unit.
        else set(cid, start.slice(0, -4) + hex(((parseInt(start.slice(-4), 16) + i) & 0xffff).toString(16), 4));
      }
    }
  return texts;
};

const toUnicodeCMap = (entries: [number, string][]) => {
  const chunks: string[] = [];
  for (let i = 0; i < entries.length; i += 100) {
    const chunk = entries.slice(i, i + 100);
    chunks.push(`${chunk.length} beginbfchar\n${chunk.map(([cid, text]) => `<${hex(cid.toString(16), 4)}> <${utf16Hex(text)}>`).join("\n")}\nendbfchar`);
  }
  return [
    "/CIDInit /ProcSet findresource begin\n12 dict begin\nbegincmap",
    "/CIDSystemInfo << /Registry (Adobe) /Ordering (UCS) /Supplement 0 >> def",
    "/CMapName /Adobe-Identity-UCS def\n/CMapType 2 def",
    "1 begincodespacerange\n<0000> <FFFF>\nendcodespacerange",
    ...chunks,
    "endcmap\nCMapName currentdict /CMap defineresource pop\nend\nend",
  ].join("\n");
};

// The PDF with every Type0 font that has a bundled reference font given a complete ToUnicode map.
// `visual` PDFs store text left-to-right as displayed, so in every font a glyph drawing several letters
// (ﷺ, لا ...) is mapped reversed, to come out in reading order once the line is reversed.
export const repairToUnicode = async (bytes: Uint8Array, visual: boolean): Promise<Uint8Array> => {
  const pdf = await PDFDocument.load(bytes, { updateMetadata: false });
  const lookup = <T extends PDFObject>(obj: PDFObject | undefined, type: { prototype: T }): T | undefined => {
    const resolved = obj instanceof PDFRef ? pdf.context.lookup(obj) : obj;
    return resolved instanceof (type as unknown as typeof PDFObject) ? (resolved as T) : undefined;
  };
  let repaired = false;
  for (const [, obj] of pdf.context.enumerateIndirectObjects()) {
    if (!(obj instanceof PDFDict) || obj.get(PDFName.of("Subtype")) !== PDFName.of("Type0")) continue;
    if (obj.get(PDFName.of("Encoding")) !== PDFName.of("Identity-H")) continue;
    const cidFont = lookup(lookup(obj.get(PDFName.of("DescendantFonts")), PDFArray)?.get(0), PDFDict);
    const descriptor = lookup(cidFont?.get(PDFName.of("FontDescriptor")), PDFDict);
    const fontFile = lookup(descriptor?.get(PDFName.of("FontFile2")), PDFRawStream);
    const baseFont = obj.get(PDFName.of("BaseFont"));
    const toUnicode = lookup(obj.get(PDFName.of("ToUnicode")), PDFRawStream);
    const existing = toUnicode ? Buffer.from(decodePDFRawStream(toUnicode).decode()).toString("latin1") : "";
    const texts = parseToUnicode(existing);
    let changed = visual && [...texts.values()].some((text) => [...text].length > 1);

    // Glyph numbers only match the font file when CID = GID.
    const reference =
      cidFont && fontFile && baseFont instanceof PDFName && !(cidFont.get(PDFName.of("CIDToGIDMap")) instanceof PDFRef)
        ? referenceFor(baseFont.decodeText().replace(/^[A-Z]{6}\+/, ""))
        : null;
    if (reference && fontFile)
      outlineKeys(Buffer.from(decodePDFRawStream(fontFile).decode())).forEach((key, gid) => {
        const text = reference.get(key);
        if (!key || !text || texts.has(gid)) return;
        texts.set(gid, text);
        changed = true;
      });
    if (!changed) continue;
    const entries = [...texts].sort(([a], [b]) => a - b);
    const cmap = toUnicodeCMap(visual ? entries.map(([cid, text]) => [cid, [...text].reverse().join("")]) : entries);
    obj.set(PDFName.of("ToUnicode"), pdf.context.register(pdf.context.flateStream(cmap)));
    repaired = true;
  }
  return repaired ? pdf.save({ useObjectStreams: false }) : bytes;
};
