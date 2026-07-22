"use client";

import Image from "next/image";
import { Clock, MapPin } from "lucide-react";
import { mosque } from "@/public/assets/icon";
import { useEffect, useMemo, useState } from "react";
import { getHijriDate } from "@/lib/hijri";
import { formatKhmerDate } from "@/lib/khmerFormatDate";
import PrayerCard from "../features/prayer/PrayerCard";
import { formatCountdown } from "@/lib/formatCountdown";
import { usePrayerTimes } from "@/app/hook/usePrayerTimes";
import { useGetCurrentLocation } from "@/app/hook/useGetCurrentLocation";
import { useGetCityName } from "@/app/hook/useGetCityName";
import { Badge } from "../ui/badge";

export const PRAYERS = [
  { key: "fajr", label: "Fajr", icon: "sunrise" },
  { key: "dhuhr", label: "Dhuhr", icon: "sun" },
  { key: "asr", label: "Asr", icon: "cloudy" },
  { key: "maghrib", label: "Maghrib", icon: "sunset" },
  { key: "isha", label: "Isha", icon: "moon" },
] as const;

export type PrayerKey = (typeof PRAYERS)[number]["key"];

formatKhmerDate(new Date());
const useKhmerDate = (date: Date = new Date()) => {
  return useMemo(() => formatKhmerDate(date), [date]);
};

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

  return (
    <div className="rounded-[28px] bg-surface border border-surface-border pt-8 px-6 sm:px-7 pb-7 flex flex-col">
      <div className="flex flex-col items-center gap-1.5 text-center">
        <div className="w-14 h-14 rounded-full bg-peach flex items-center justify-center">
          <Image src={mosque} alt="mosque" className="w-7 h-7" />
        </div>
        <h1 className="font-heading text-2xl text-ink mt-0.5">ម៉ោងសឡាត</h1>
        <Badge className="bg-badge-green text-badge-green-foreground hover:bg-badge-green rounded-full text-[11px] font-normal px-2.5 py-1 h-auto flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {addr?.town} · {addr?.state}
        </Badge>
      </div>

      <div className="flex items-center justify-between gap-4 mt-5 px-5 py-4 bg-surface-soft rounded-[28px] flex-wrap">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-ink-muted">ថ្ងៃនេះ</span>
          <span className="text-sm text-ink">
            {KhmerDate} · {getHijriDate()}
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center bg-peach text-amber text-[11px] px-2.5 py-1 rounded-full">
            បន្ទាប់ {nextSalah}
          </span>
          <div className="flex items-center gap-1.5 text-[15px] font-semibold tabular-nums text-amber">
            <Clock className="w-[15px] h-[15px] animate-pulse shrink-0" />
            {countdown}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-1.5 sm:gap-3 mt-4">
        {PRAYERS.map(({ key, label, icon }) => (
          <PrayerCard
            key={key}
            icon={icon}
            nameTimePrayer={label}
            timePrayer={times[key].toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
            nextPrayer={key == nextSalah}
          />
        ))}
      </div>
    </div>
  );
}
