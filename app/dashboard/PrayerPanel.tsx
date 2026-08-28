"use client";

import {
  Clock,
  CloudSun,
  MapPin,
  Moon,
  Sun,
  Sunrise,
  Sunset,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getHijriDate } from "@/lib/hijri";
import { formatKhmerDate } from "@/lib/khmerFormatDate";
import PrayerCard from "../features/prayer/PrayerCard";
import { formatCountdown } from "@/lib/formatCountdown";
import { usePrayerTimes } from "@/app/hook/usePrayerTimes";
import { useGetCurrentLocation } from "@/app/hook/useGetCurrentLocation";
import { useGetCityName } from "@/app/hook/useGetCityName";

export const PRAYERS = [
  { key: "fajr", label: "Fajr", icon: Sunrise },
  { key: "dhuhr", label: "Dhuhr", icon: Sun },
  { key: "asr", label: "Asr", icon: CloudSun },
  { key: "maghrib", label: "Maghrib", icon: Sunset },
  { key: "isha", label: "Isha", icon: Moon },
] as const;

export type PrayerKey = (typeof PRAYERS)[number]["key"];

const useKhmerDate = (date: Date = new Date()) => {
  return useMemo(() => formatKhmerDate(date), [date]);
};

const formatTime = (date: Date) =>
  date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

function MosqueMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M4 21v-8a8 8 0 0 1 16 0v8M12 5V2M9 21v-4a3 3 0 0 1 6 0v4" />
    </svg>
  );
}

/** "បន្ទាប់ · MAGHRIB" — the kicker above the hero time. */
function NextKicker({ label, size }: { label: string; size: "sm" | "md" }) {
  const text = size === "sm" ? "text-[11px]" : "text-xs";
  return (
    <div className="flex items-center gap-2">
      <span className={`${text} font-black tracking-[0.06em] opacity-80`}>
        បន្ទាប់
      </span>
      <span className="w-1 h-1 rounded-full bg-current opacity-50" />
      <span className={`${text} font-black tracking-[0.1em] uppercase opacity-80`}>
        {label}
      </span>
    </div>
  );
}

function CountdownPill({
  countdown,
  size,
}: {
  countdown: string;
  size: "sm" | "md";
}) {
  return (
    <div
      className={`inline-flex items-center gap-[9px] rounded-full bg-white/15 ${
        size === "sm" ? "px-[15px] py-2" : "px-4 py-[9px]"
      }`}
    >
      <Clock
        strokeWidth={2.75}
        className={size === "sm" ? "w-[15px] h-[15px]" : "w-4 h-4"}
      />
      <span
        className={`font-black tabular-nums text-white ${
          size === "sm" ? "text-[17px]" : "text-xl"
        }`}
      >
        {countdown}
      </span>
    </div>
  );
}

function SunCard({
  icon: Icon,
  label,
  time,
}: {
  icon: LucideIcon;
  label: string;
  time: string;
}) {
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

export default function PrayerPanel() {
  const { data: location } = useGetCurrentLocation();
  const [countdown, setCountdown] = useState("");
  const [nextSalah, setNextPrayer] = useState<PrayerKey>("fajr");
  const KhmerDate = useKhmerDate();
  const lat = location?.coords.latitude;
  const lng = location?.coords.longitude;
  const { data: times, isLoading } = usePrayerTimes(lat, lng);
  const { data: addr } = useGetCityName(lat, lng);

  // countdown ticker
  useEffect(() => {
    if (!times) return;

    const tick = () => {
      const next = times.nextPrayer();
      const nextSalahTime = times.timeForPrayer(next);
      if (!nextSalahTime) return;

      if (next !== "sunrise" && next !== "none") {
        setNextPrayer(next);
      }
      const diffSeconds = Math.floor(
        (nextSalahTime.getTime() - Date.now()) / 1000,
      );
      setCountdown(formatCountdown(Math.max(0, diffSeconds)));
    };

    tick(); // run immediately
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [times]);

  if (isLoading) return <p>Loading...</p>;
  if (!times) return <p>Failed to load.</p>;

  const next = PRAYERS.find((p) => p.key === nextSalah) ?? PRAYERS[0];
  const rest = PRAYERS.filter((p) => p.key !== next.key);
  const place = [addr?.town, addr?.state].filter(Boolean).join(" · ");
  const sun = [
    { icon: Sunrise, label: "ថ្ងៃរះ", time: formatTime(times.sunrise) },
    { icon: Sunset, label: "ថ្ងៃលិច", time: formatTime(times.sunset) },
  ];

  return (
    <div className="overflow-hidden rounded-[28px] bg-surface md:px-[30px] md:pt-[30px] md:pb-8">
      {/* ── desktop header ───────────────────────────────────────────── */}
      <div className="hidden md:flex items-start justify-between gap-6 mb-[26px]">
        <div className="flex items-center gap-3.5">
          <div className="flex w-[52px] h-[52px] shrink-0 items-center justify-center rounded-full bg-sage-soft text-sage-ink">
            <MosqueMark className="w-[26px] h-[26px]" />
          </div>
          <div>
            <h1 className="font-heading text-[28px] font-bold leading-[1.15] text-ink">
              ម៉ោងសឡាត
            </h1>
            <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-peach px-2.5 py-1 text-[12.5px] font-semibold text-amber-ink">
              <MapPin strokeWidth={2.75} className="w-[13px] h-[13px]" />
              {place}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="mb-1 text-[11px] tracking-[0.06em] uppercase text-ink-muted">
            ថ្ងៃនេះ
          </div>
          <div className="text-sm font-semibold text-ink">{KhmerDate}</div>
          <div className="mt-0.5 text-[13px] text-ink-muted">
            {getHijriDate()}
          </div>
        </div>
      </div>

      {/* ── mobile hero (header lives inside it) ─────────────────────── */}
      <div className="md:hidden relative overflow-hidden rounded-b-[28px] bg-sage px-[22px] pt-5 pb-7 text-sage-foreground">
        <div className="pointer-events-none absolute -right-[50px] -top-14 w-[180px] h-[180px] rounded-full bg-white/[0.07]" />
        <div className="relative flex items-center gap-[11px]">
          <div className="flex w-9 h-9 shrink-0 items-center justify-center rounded-full bg-white/15 text-white">
            <MosqueMark className="w-[19px] h-[19px]" />
          </div>
          <div>
            <h1 className="font-heading text-[19px] font-bold leading-[1.2] text-white">
              ម៉ោងសឡាត
            </h1>
            <div className="mt-0.5 flex items-center gap-1.5 opacity-85">
              <MapPin strokeWidth={2.75} className="w-3 h-3 shrink-0" />
              <span className="text-xs font-semibold">{place}</span>
            </div>
          </div>
        </div>
        <div className="relative mt-6">
          <NextKicker label={next.label} size="sm" />
          <div className="mt-1.5 font-numeral text-[44px] leading-none text-white tabular-nums">
            {formatTime(times[next.key])}
          </div>
          <div className="mt-3.5">
            <CountdownPill countdown={countdown} size="sm" />
          </div>
        </div>
      </div>

      {/* ── desktop hero + sunrise/sunset column ─────────────────────── */}
      <div className="hidden md:flex items-stretch gap-3.5 mb-3.5">
        <div className="relative flex flex-1 items-center justify-between gap-5 overflow-hidden rounded-[28px] bg-sage px-7 py-[26px] text-sage-foreground">
          <div className="pointer-events-none absolute -right-[38px] -bottom-14 w-[180px] h-[180px] rounded-full bg-white/[0.06]" />
          <div className="relative">
            <NextKicker label={next.label} size="md" />
            <div className="mt-2 font-numeral text-[46px] leading-none text-white tabular-nums">
              {formatTime(times[next.key])}
            </div>
          </div>
          <div className="relative text-right">
            <div className="mb-1.5 text-[11px] tracking-[0.06em] opacity-80">
              ក្នុងរយៈពេល
            </div>
            <CountdownPill countdown={countdown} size="md" />
          </div>
        </div>
        <div className="flex w-[186px] shrink-0 flex-col gap-2.5">
          {sun.map((s) => (
            <SunCard key={s.label} {...s} />
          ))}
        </div>
      </div>

      {/* ── the remaining prayers ────────────────────────────────────── */}
      <div className="px-[22px] pt-5 pb-[22px] md:p-0">
        <div className="mb-3.5 md:hidden">
          <div className="text-[13px] font-semibold text-ink">{KhmerDate}</div>
          <div className="text-xs text-ink-muted">{getHijriDate()}</div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-3.5">
          {rest.map(({ key, label, icon }) => (
            <PrayerCard
              key={key}
              icon={icon}
              nameTimePrayer={label}
              timePrayer={formatTime(times[key])}
              toned={key === "isha"}
            />
          ))}
        </div>

        <div className="mt-2.5 flex gap-2.5 md:hidden">
          {sun.map((s) => (
            <SunCard key={s.label} {...s} />
          ))}
        </div>
      </div>
    </div>
  );
}
