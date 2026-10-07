"use client";

import { useState } from "react";
import CardCollection, {
  ViewToggle,
  type View,
} from "@/app/components/CardCollection";
import DuaCard from "./DuaCard";
import type { Dua } from "@/types";

/** A category's duas, as gradient cards or as a list. */
export default function DuaList({ duas }: { duas: Dua[] }) {
  const [view, setView] = useState<View>("grid");

  return (
    <>
      <div className="mb-4 flex justify-end">
        <ViewToggle view={view} onChange={setView} />
      </div>

      {view === "grid" ? (
        <section className="rounded-3xl bg-surface-soft/60 p-4 sm:p-6">
          <div className="motion-stagger grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {duas.map((dua) => (
              <DuaCard key={dua.id} dua={dua} />
            ))}
          </div>
        </section>
      ) : (
        <CardCollection
          view="accordion"
          items={duas.map((dua, i) => ({
            id: dua.id,
            badge: i + 1,
            href: `/dua/${dua.id}`,
            khmerTitle: dua.title,
            meta: dua.reference,
            openLabel: "អានទូអា",
            entries: [],
          }))}
        />
      )}
    </>
  );
}
