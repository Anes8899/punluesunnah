"use client";

import Link from "next/link";
import { ChevronRight, LayoutGrid, List } from "lucide-react";
import BookCard from "@/app/components/BookCard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/ui/accordion";

export type View = "grid" | "accordion";

export interface CollectionEntry {
  key: string | number;
  href: string;
  badge?: string | number;
  khmerTitle: string;
  arabicTitle?: string;
  /** When present, the entry is itself an accordion that expands to these. */
  entries?: CollectionEntry[];
  openLabel?: string;
}

export interface CollectionItem {
  id: string | number;
  href: string;
  arabicTitle: string;
  khmerTitle: string;
  meta?: string;
  /** Shown when the item is expanded in the accordion view. */
  entries: CollectionEntry[];
  openLabel: string;
}

const VIEWS: { value: View; label: string; Icon: typeof LayoutGrid }[] = [
  { value: "grid", label: "បង្ហាញជាក្រឡា", Icon: LayoutGrid },
  { value: "accordion", label: "បង្ហាញជាបញ្ជី", Icon: List },
];

export function ViewToggle({
  view,
  onChange,
}: {
  view: View;
  onChange: (view: View) => void;
}) {
  return (
    <div className="flex shrink-0 rounded-full border border-surface-border bg-surface-soft p-1">
      {VIEWS.map(({ value, label, Icon }) => (
        <button
          key={value}
          type="button"
          onClick={() => onChange(value)}
          aria-label={label}
          aria-pressed={view === value}
          className="flex size-9 items-center justify-center rounded-full text-ink-muted transition-colors hover:text-amber-ink aria-pressed:bg-background aria-pressed:text-amber-ink aria-pressed:shadow-sm"
        >
          <Icon className="size-4" />
        </button>
      ))}
    </div>
  );
}

function OpenLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-end gap-1 rounded-xl px-3 py-2 text-sm font-bold text-amber-ink no-underline! transition-colors hover:bg-[#f0fae1]"
    >
      {label}
      <ChevronRight className="size-4" />
    </Link>
  );
}

function EntryTitle({ entry }: { entry: CollectionEntry }) {
  return (
    <>
      {entry.badge !== undefined && (
        <span className="min-w-6 shrink-0 text-center text-sm font-bold text-[#56633f] tabular-nums">
          {entry.badge}
        </span>
      )}
      <span className="flex min-w-0 flex-1 flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-3">
        <span className="font-khmer min-w-0 flex-1 text-sm leading-relaxed text-[#201e1d] wrap-break-word">
          {entry.khmerTitle}
        </span>
        {entry.arabicTitle && (
          <span
            dir="rtl"
            className="font-arabic text-base leading-relaxed text-[#8c491a] wrap-break-word sm:max-w-[45%] sm:shrink-0"
          >
            {entry.arabicTitle}
          </span>
        )}
      </span>
    </>
  );
}

/** The body of an open accordion item: its entries, then a link to open it. */
function EntryPanel({
  entries,
  href,
  openLabel,
}: {
  entries: CollectionEntry[];
  href: string;
  openLabel?: string;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-[18px] bg-background/60 p-1 sm:p-2">
      {entries.length > 0 && (
        <Accordion type="multiple" className="gap-1">
          {entries.map((entry) =>
            entry.entries?.length ? (
              <AccordionItem
                key={entry.key}
                value={String(entry.key)}
                className="rounded-xl border-none"
              >
                <AccordionTrigger className="items-center gap-2 rounded-xl px-2 py-2.5 hover:bg-[#f0fae1] hover:no-underline sm:gap-3 sm:px-3">
                  <EntryTitle entry={entry} />
                </AccordionTrigger>
                <AccordionContent className="pb-1 pl-2 sm:pl-6">
                  <EntryPanel
                    entries={entry.entries}
                    href={entry.href}
                    openLabel={entry.openLabel}
                  />
                </AccordionContent>
              </AccordionItem>
            ) : (
              <Link
                key={entry.key}
                href={entry.href}
                className="flex items-center gap-2 rounded-xl px-2 py-2.5 no-underline! transition-colors hover:bg-[#f0fae1] sm:gap-3 sm:px-3"
              >
                <EntryTitle entry={entry} />
              </Link>
            ),
          )}
        </Accordion>
      )}
      {openLabel && <OpenLink href={href} label={openLabel} />}
    </div>
  );
}

export default function CardCollection({
  items,
  view,
}: {
  items: CollectionItem[];
  view: View;
}) {
  if (view === "grid") {
    return (
      <div className="motion-stagger grid w-full grid-cols-2 gap-4 sm:grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
        {items.map((item) => (
          <BookCard
            key={item.id}
            href={item.href}
            badge={item.id}
            arabicTitle={item.arabicTitle}
            khmerTitle={item.khmerTitle}
          />
        ))}
      </div>
    );
  }

  return (
    <Accordion type="multiple" className="motion-stagger gap-3">
      {items.map((item) => (
        <AccordionItem
          key={item.id}
          value={String(item.id)}
          className="overflow-hidden rounded-[24px] border-none bg-[#ebddc5] shadow-[0_1px_2px_rgba(46,43,37,0.14)]"
        >
          <AccordionTrigger className="items-center gap-3 px-4 py-3 hover:no-underline sm:gap-4 sm:px-5 sm:py-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#f0fae1] text-base font-bold text-[#56633f] sm:size-[44px]">
              {item.id}
            </span>
            <span className="flex min-w-0 flex-1 flex-col gap-1">
              <span
                dir="rtl"
                className="font-arabic text-lg leading-relaxed text-[#8c491a] wrap-break-word sm:text-xl"
              >
                {item.arabicTitle}
              </span>
              <span className="font-khmer text-[15px] font-bold leading-relaxed text-[#201e1d] wrap-break-word sm:text-base">
                {item.khmerTitle}
              </span>
              {item.meta && (
                <span className="text-xs text-ink-muted sm:hidden">
                  {item.meta}
                </span>
              )}
            </span>
            {item.meta && (
              <span className="hidden shrink-0 text-xs text-ink-muted sm:inline">
                {item.meta}
              </span>
            )}
          </AccordionTrigger>
          <AccordionContent className="px-2 pb-2 sm:px-3 sm:pb-3">
            <EntryPanel
              entries={item.entries}
              href={item.href}
              openLabel={item.openLabel}
            />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
