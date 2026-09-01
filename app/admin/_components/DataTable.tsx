"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/app/ui/badge";
import { Input } from "@/app/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/ui/table";

/**
 * Cells are plain values, not render functions: these rows are built in Server
 * Components and functions cannot cross the RSC boundary.
 */
export type Cell = string | number | { kind: "badge"; text: string };

export interface Row {
  id: string;
  href?: string;
  cells: Cell[];
}

export interface Filter {
  label: string;
  /** Index into `cells` whose text is matched against the chosen option. */
  cellIndex: number;
  options: string[];
}

function cellText(cell: Cell): string {
  return typeof cell === "object" ? cell.text : String(cell);
}

export default function DataTable({
  headers,
  rows,
  filter,
  searchPlaceholder = "ស្វែងរក...",
  emptyMessage = "រកមិនឃើញទិន្នន័យ",
}: {
  headers: string[];
  rows: Row[];
  filter?: Filter;
  searchPlaceholder?: string;
  emptyMessage?: string;
}) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((row) => {
      if (filter && selected && cellText(row.cells[filter.cellIndex] ?? "") !== selected) {
        return false;
      }
      if (!q) return true;
      return row.cells.some((cell) => cellText(cell).toLowerCase().includes(q));
    });
  }, [rows, query, selected, filter]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-56 flex-1">
          <Search
            className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
            aria-hidden
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            className="pr-9 pl-9"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="សម្អាតការស្វែងរក"
              className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
            >
              <X className="size-4" />
            </button>
          ) : null}
        </div>

        {filter ? (
          <div className="flex flex-wrap items-center gap-1">
            <FilterChip
              label="ទាំងអស់"
              active={selected === ""}
              onClick={() => setSelected("")}
            />
            {filter.options.map((option) => (
              <FilterChip
                key={option}
                label={option}
                active={selected === option}
                onClick={() => setSelected(option)}
              />
            ))}
          </div>
        ) : null}
      </div>

      <p className="text-muted-foreground text-xs">
        {filtered.length} / {rows.length}
      </p>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              {headers.map((header) => (
                <TableHead key={header}>{header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={headers.length}
                  className="text-muted-foreground h-24 text-center"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((row) => (
                <TableRow key={row.id}>
                  {row.cells.map((cell, i) => (
                    <TableCell key={i} className={cn(i === 0 && "font-bold")}>
                      {typeof cell === "object" ? (
                        <Badge variant="secondary">{cell.text}</Badge>
                      ) : i === 0 && row.href ? (
                        <Link href={row.href} className="hover:underline">
                          {cell}
                        </Link>
                      ) : (
                        cell
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs transition-colors",
        active
          ? "bg-primary text-primary-foreground border-transparent font-bold"
          : "text-muted-foreground hover:bg-muted",
      )}
    >
      {label}
    </button>
  );
}
