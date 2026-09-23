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
      className="group hover-lift press relative flex h-full flex-col gap-2 overflow-hidden rounded-[32px] bg-[#ebddc5] p-5 text-left no-underline shadow-[0_1px_2px_rgba(46,43,37,0.14)] hover:shadow-[0_10px_24px_rgba(46,43,37,0.18)]"
    >
      <span className="sheen" aria-hidden />
      <span className="flex size-[52px] shrink-0 items-center justify-center rounded-full bg-[#f0fae1] text-lg font-bold text-[#56633f] transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
        {badge}
      </span>
      <span className="font-arabic text-2xl leading-relaxed text-[#8c491a]">
        {arabicTitle}
      </span>
      <span className="font-khmer text-lg font-bold text-[#201e1d]">
        {khmerTitle}
      </span>
    </Link>
  );
}
