"use client";

import { useState } from "react";
import CardCollection, {
  ViewToggle,
  type CollectionItem,
  type View,
} from "@/app/components/CardCollection";

export default function LessonList({ items }: { items: CollectionItem[] }) {
  const [view, setView] = useState<View>("grid");

  return (
    <>
      <div className="mb-4 flex justify-end">
        <ViewToggle view={view} onChange={setView} />
      </div>
      <CardCollection items={items} view={view} />
    </>
  );
}
