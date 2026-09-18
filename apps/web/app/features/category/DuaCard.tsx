import Link from "next/link";
import type { Dua } from "@punluesunnah/shared-types";
import { getCategoryMeta } from "./duaCategoryMeta";

export default function DuaCard({ dua }: { dua: Dua }) {
  const { icon: Icon, gradient } = getCategoryMeta(dua.category);

  return (
    <Link
      href={`/dua/${dua.id}`}
      className="group hover-lift press relative overflow-hidden rounded-2xl bg-background text-center no-underline shadow-sm hover:shadow-lg"
    >
      <span
        className={`flex h-28 flex-col items-center justify-center gap-1.5 bg-linear-to-br sm:h-32 ${gradient}`}
      >
        <Icon
          className="size-8 text-white drop-shadow-sm transition-transform duration-300 ease-out group-hover:-rotate-6 group-hover:scale-125 sm:size-9"
          strokeWidth={1.5}
        />
        <span className="text-xs font-semibold text-white drop-shadow-sm">
          {dua.category}
        </span>
      </span>
      <span className="sheen" aria-hidden />
      <span className="block px-3 py-3 text-sm font-semibold text-ink sm:text-base">
        {dua.title}
      </span>
    </Link>
  );
}
