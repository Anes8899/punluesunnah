import Link from "next/link";
import type { Dua } from "./duaData";
import { getCategoryMeta } from "./duaCategoryMeta";

export default function DuaCard({ dua }: { dua: Dua }) {
  const { icon: Icon, gradient } = getCategoryMeta(dua.category);

  return (
    <Link
      href={`/dua/${dua.id}`}
      className="group overflow-hidden rounded-2xl bg-background text-center no-underline shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      <span
        className={`flex h-28 flex-col items-center justify-center gap-1.5 bg-linear-to-br sm:h-32 ${gradient}`}
      >
        <Icon
          className="size-8 text-white drop-shadow-sm transition-transform group-hover:scale-110 sm:size-9"
          strokeWidth={1.5}
        />
        <span className="text-xs font-semibold text-white drop-shadow-sm">
          {dua.category}
        </span>
      </span>
      <span className="block px-3 py-3 text-sm font-semibold text-ink sm:text-base">
        {dua.title}
      </span>
    </Link>
  );
}
