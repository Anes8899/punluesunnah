"use client";

import { CloudSun, MapPin, Moon, Sun, Sunrise, Sunset } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getHijriDate } from "@/lib/hijri";
import { formatKhmerDate } from "@/lib/khmerFormatDate";
import PrayerCard from "../features/prayer/PrayerCard";
import CountdownPill from "../features/prayer/CountdownPill";
import DesktopPrayerHero from "../features/prayer/DesktopPrayerHero";
import NextKicker from "../features/prayer/NextKicker";
import SunCard from "../features/prayer/SunCard";
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
    <div className="mx-6 mt-6 overflow-hidden rounded-[28px] bg-surface md:mx-0 md:mt-0 md:flex md:min-h-[27rem] md:flex-col md:justify-center md:overflow-visible md:rounded-none md:px-10 md:py-9 xl:aspect-[6912/3000] xl:min-h-0 xl:px-[5%] xl:py-[3%]">
      {/* The mandala frame is a sibling in app/page.tsx and keeps its own
          aspect ratio, so from `xl` up this panel carries that ratio too and
          the frame lands exactly on its edges. Narrower than that the art is
          too wide to box this much content, so the panel keeps a min-height
          and the frame centres inside it instead. The `xl` padding is a
          percentage of the width, matching how the art scales, and keeps
          content inside the frame's border. */}
      <div className="relative z-10 w-full md:mx-auto md:max-w-7xl">
        {/* ── desktop header ───────────────────────────────────────────── */}
        <div className="hidden md:flex items-start justify-between gap-6 mb-[26px]">
          <div className="flex items-center gap-3.5">
            <div className="flex w-[52px] h-[52px] shrink-0 items-center justify-center rounded-full bg-sage-soft text-sage-ink">
              <MosqueMark className="w-[26px] h-[26px]"/>
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
        <DesktopPrayerHero
          nextLabel={next.label}
          nextTime={formatTime(times[next.key])}
          countdown={countdown}
          sun={sun}
        />

        {/* ── the remaining prayers ────────────────────────────────────── */}
        <div className="px-[22px] pt-5 pb-[22px] md:p-0">
          <div className="mb-3.5 md:hidden">
            <div className="text-[13px] font-semibold text-ink">{KhmerDate}</div>
            <div className="text-xs text-ink-muted">{getHijriDate()}</div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-3.5 lg:gap-4">
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
    </div>
  );
}
