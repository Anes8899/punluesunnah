import type { LucideIcon } from "lucide-react";

export interface SunCardProps {
  icon: LucideIcon;
  label: string;
  time: string;
}

export default function SunCard({ icon: Icon, label, time }: SunCardProps) {
  return (
    <div className="flex flex-1 items-center gap-[11px] rounded-2xl bg-peach px-4 py-[13px] md:py-3.5">
      <Icon
        strokeWidth={2.75}
        className="w-[17px] h-[17px] md:w-[19px] md:h-[19px] shrink-0 text-amber-ink/75"
      />
      <div>
        <div className="text-[11px] leading-[1.3] text-ink-muted">{label}</div>
        <div className="text-sm font-bold tabular-nums text-amber-ink">
          {time}
        </div>
      </div>
    </div>
  );
}
