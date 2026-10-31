// Turns lines of book text into chapters -> sections -> definitions / paragraphs.
// Headings are matched with tashkeel and tatweel removed; stored text keeps them.

export type Definition = { term: string; text: string };
export type Section = { id: string; title: string; definitions: Definition[]; paragraphs: string[] };
export type ChapterData = { title: string; sections: Section[] };

const stripTashkeel = (s: string) => s.replace(/[ؐ-ًؚ-ٰٟۖ-ۭـ]/g, "");

// `\b` doesn't treat Arabic letters as word characters, so headings end at whitespace, a colon or the line end.
const chapterHeading = /^(ال)?باب(?=[\s:：]|$)/;
const sectionHeading = /^(الفصل|المبحث|المطلب)(?=[\s:：]|$)/;
const ordinals = "اولا|أولا|ثانيا|ثالثا|رابعا|خامسا|سادسا|سابعا|ثامنا|تاسعا|عاشرا";
const numberedHeading = new RegExp(`^([0-9٠-٩]+\\s*[-–.)]|(${ordinals})\\s*[:：\\-–]?)`);
// The marker itself ("1.", "١-", "أولاً:") is dropped from a numbered section's title.
const numberedMarker = /^(?:[0-9٠-٩]+|\p{L}[\p{L}\p{M}]*)\s*[-–.):：]\s*/u;
// "term: text" where the term is at most five words, e.g. "الطَّهَارَةُ لُغَةً: النَّظَافَةُ".
const definitionLine = /^([^:：]{1,80}?)\s*[:：]\s*(.+)$/;

export const isChapterHeading = (line: string) => chapterHeading.test(stripTashkeel(line));

const sectionTitle = (line: string): string | null => {
  const plain = stripTashkeel(line);
  if (sectionHeading.test(plain)) return line;
  if (numberedHeading.test(plain)) return line.replace(numberedMarker, "").trim() || line;
  return null;
};

const asDefinition = (line: string): Definition | null => {
  const match = definitionLine.exec(line);
  if (!match || match[1].trim().split(/\s+/).length > 5) return null;
  return { term: match[1].trim(), text: match[2].trim() };
};

// Sections of one chapter. Lines before the first section heading go into an untitled section.
export const parseSections = (chapterNumber: number, lines: string[]): Section[] => {
  const sections: Section[] = [];
  const start = (title: string) => {
    const section = { id: `${chapterNumber}.${sections.length + 1}`, title, definitions: [], paragraphs: [] };
    sections.push(section);
    return section;
  };
  let current: Section | undefined;
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    const title = sectionTitle(line);
    if (title !== null) {
      current = start(title);
      continue;
    }
    current ??= start("");
    const definition = asDefinition(line);
    if (definition) current.definitions.push(definition);
    else current.paragraphs.push(line);
  }
  return sections;
};

// Splits lines at chapter headings (the heading line is the title). Text before the first
// heading is dropped. Returns [] when there are no chapter headings.
export const linesToChapters = (lines: string[]): ChapterData[] => {
  const groups: { title: string; lines: string[] }[] = [];
  for (const line of lines) {
    if (isChapterHeading(line.trim())) groups.push({ title: line.trim(), lines: [] });
    else groups[groups.length - 1]?.lines.push(line);
  }
  return groups.map((g, i) => ({ title: g.title, sections: parseSections(i + 1, g.lines) }));
};
