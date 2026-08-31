import CountdownPill from "./CountdownPill";
import NextKicker from "./NextKicker";
import SunCard, { type SunCardProps } from "./SunCard";

interface DesktopPrayerHeroProps {
  /** Name of the upcoming prayer, e.g. "Maghrib". */
  nextLabel: string;
  /** Already-formatted time of the upcoming prayer. */
  nextTime: string;
  countdown: string;
  sun: SunCardProps[];
}

/** Desktop-only hero: the next prayer beside the sunrise/sunset column. */
export default function DesktopPrayerHero({
  nextLabel,
  nextTime,
  countdown,
  sun,
}: DesktopPrayerHeroProps) {
  return (
    <div className="hidden md:flex items-stretch gap-3.5 mb-3.5">
      <div className="relative flex flex-1 items-center justify-between gap-5 overflow-hidden rounded-[28px] bg-sage px-7 py-[26px] text-sage-foreground lg:px-10 lg:py-14">
        <div className="pointer-events-none absolute -right-[38px] -bottom-14 w-[180px] h-[180px] rounded-full bg-white/[0.06]" />
        <div className="relative">
          <NextKicker label={nextLabel} size="md" />
          <div className="mt-2 font-numeral text-[46px] leading-none text-white tabular-nums lg:text-[60px]">
            {nextTime}
          </div>
        </div>
        <div className="relative text-right">
          <div className="mb-1.5 text-[11px] tracking-[0.06em] opacity-80">
            ក្នុងរយៈពេល
          </div>
          <CountdownPill countdown={countdown} size="md" />
        </div>
      </div>
      <div className="flex w-[186px] shrink-0 flex-col gap-2.5 lg:w-[230px] lg:gap-3.5">
        {sun.map((s) => (
          <SunCard key={s.label} {...s} />
        ))}
      </div>
    </div>
  );
}
