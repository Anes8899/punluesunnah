import Link from "next/link";

interface BookCardProps {
  href: string;
  badge: string | number;
  arabicTitle: string;
  khmerTitle: string;
}

export default function BookCard({
  href,
  badge,
  arabicTitle,
  khmerTitle,
}: BookCardProps) {
  return (
    <Link
      href={href}
      className="group/book relative flex h-full flex-col items-center gap-3.5 rounded-2xl bg-linear-to-b from-badge-green via-badge-green/40 to-surface-soft px-3 pt-14 pb-5 text-center no-underline shadow-sm transition-all hover:from-badge-green hover:via-badge-green hover:to-surface-soft hover:shadow-md sm:px-4 sm:pt-16 sm:pb-6"
    >
      <span className="absolute top-3 left-3 flex size-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-background to-badge-green text-sm font-bold text-badge-green-foreground shadow-sm transition-all group-hover/book:from-badge-green-foreground group-hover/book:to-badge-green-foreground group-hover/book:text-badge-green sm:size-10 sm:text-base">
        {badge}
      </span>

      <span className="flex min-w-0 flex-1 flex-col items-center">
        <span className="font-arabic block text-2xl leading-relaxed text-balance text-amber sm:text-3xl">
          {arabicTitle}
        </span>
        <span className="mt-3 block text-base leading-relaxed font-medium text-balance text-ink sm:mt-4 sm:text-lg">
          {khmerTitle}
        </span>
      </span>
    </Link>
  );
}
