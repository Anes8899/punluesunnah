import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface PrayerCardProps {
  nameTimePrayer: string;
  timePrayer: string;
  icon: LucideIcon;
  /** Isha carries the sage tone in the design; the rest stay neutral. */
  toned?: boolean;
}

export default function PrayerCard({
  nameTimePrayer,
  timePrayer,
  icon: Icon,
  toned = false,
}: PrayerCardProps) {
  return (
    <div className="flex items-center gap-[11px] md:gap-3 rounded-2xl bg-surface-soft px-4 py-3.5 md:px-[18px] md:py-4">
      <Icon
        strokeWidth={2.75}
        className={cn(
          "w-[18px] h-[18px] md:w-5 md:h-5 shrink-0",
          toned ? "text-sage-mid" : "text-ink-muted",
        )}
      />
      <div className="min-w-0">
        <div className="text-[11px] md:text-xs font-semibold tracking-[0.08em] uppercase text-ink-muted">
          {nameTimePrayer}
        </div>
        <div className="text-base md:text-[17px] font-bold tabular-nums text-ink">
          {timePrayer}
        </div>
      </div>
    </div>
  );
}
