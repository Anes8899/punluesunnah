import { DynamicIcon, IconName } from "lucide-react/dynamic";
import { cn } from "@/lib/utils";

interface PrayerTime {
  nameTimePrayer: string;
  timePrayer: string;
  icon: IconName;
  nextPrayer: boolean;
}

export default function PrayerCard({
  nameTimePrayer,
  timePrayer,
  icon,
  nextPrayer,
}: PrayerTime) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 py-4 px-2 rounded-[28px] text-center transition-colors",
        nextPrayer ? "bg-[#c67139] shadow-md" : "bg-[#f9f4ed]",
      )}
    >
      <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shrink-0">
        <DynamicIcon name={icon} className="w-5 h-5 text-[#8c491a]" />
      </div>
      <div
        className={cn(
          "font-heading text-sm",
          nextPrayer ? "text-white" : "text-[#201e1d]",
        )}
      >
        {nameTimePrayer}
      </div>
      <div
        className={cn(
          "text-[15px] font-semibold tabular-nums",
          nextPrayer ? "text-white" : "text-[#2e2b25]",
        )}
      >
        {timePrayer}
      </div>
    </div>
  );
}
