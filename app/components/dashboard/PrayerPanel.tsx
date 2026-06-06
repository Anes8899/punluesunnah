"use client";

import Image from "next/image";
import { Clock, MapPin } from "lucide-react";
import { mosque } from "@/app/assets/icon";
import { useEffect, useMemo, useState } from "react";
import { getHijriDate } from "@/lib/hijri";
import { formatKhmerDate } from "@/lib/khmerFormatDate";
import PrayerCard from "../features/prayer/PrayerCard";
import { getPrayerTime, PrayerTimes } from "@/lib/getPrayerTime";
import { getNextPrayer } from "@/lib/getNextPrayer";
import { formatCountdown } from "@/lib/formatCountdown";

export const PRAYERS = [
  { key: "Fajr", label: "Fajr", icon: "sunrise" },
  { key: "Dhuhr", label: "Dhuhr", icon: "sun" },
  { key: "Asr", label: "Asr", icon: "cloudy" },
  { key: "Maghrib", label: "Maghrib", icon: "sunset" },
  { key: "Isha", label: "Isha", icon: "moon" },
] as const;

export type PrayerKey = (typeof PRAYERS)[number]["key"];

formatKhmerDate(new Date());
const useKhmerDate = (date: Date = new Date()) => {
  return useMemo(() => formatKhmerDate(date), [date]);
};

export default function PrayerPanel() {
  const [times, setTimes] = useState<PrayerTimes | null>(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState("");
  const [nextPrayer, setNextPrayer] = useState<{
    key: PrayerKey;
    label: string;
  } | null>(null);

  const KhmerDate = useKhmerDate();

  useEffect(() => {
    getPrayerTime()
      .then(setTimes)
      .finally(() => setLoading(false));
  }, []);

  // countdown ticker
  useEffect(() => {
    if (!times) return;

    const tick = () => {
      const next = getNextPrayer(times);
      if (!next) {
        setNextPrayer(null);
        setCountdown("");
        return;
      }

      setNextPrayer({ key: next.key, label: next.label });

      const diffSeconds = Math.floor((next.time.getTime() - Date.now()) / 1000);
      setCountdown(formatCountdown(Math.max(0, diffSeconds)));
    };

    tick(); // run immediately
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [times]);

  if (loading) return <p>Loading...</p>;
  if (!times) return <p>Failed to load.</p>;

  return (
    <div className="rounded-lg bg-white shadow-md flex flex-col p-5">
      <div className="w-52 mx-auto flex flex-col justify-center items-center">
        <div className="flex flex-col items-center justify-center gap-2">
          <Image src={mosque} alt="mosque" className="w-8 h-8" />
          <h1 className="scroll-m-20 text-center text-lg font-extrabold tracking-tight text-balance">
            ម៉ោងសឡាត
          </h1>
        </div>
        <div className="flex items-center justify-center gap-1 px-2">
          <MapPin className="w-4 h-4 shrink-0 text-red-500" />
          <p>Phnom Penh</p>
        </div>
        <div className="flex items-center justify-center gap-1 px-2">
          <p>{getHijriDate()}</p>
        </div>
      </div>
      <div className="bg-card border border-border rounded-2xl px-5 py-4 flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] text-muted-foreground uppercase tracking-widest font-medium">
            ថ្ងៃនេះ
          </span>
          <span className="text-[15px] font-medium">{KhmerDate}</span>
        </div>

        <div className="w-px h-9 bg-border" />

        <div className="flex flex-col gap-1 items-end">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-muted-foreground uppercase tracking-widest font-medium">
              បន្ទាប់
            </span>
            <span className="text-[11px] bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 px-2 py-0.5 rounded-full font-medium">
              {nextPrayer?.label}
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <Clock className="w-3 h-3 text-muted-foreground" />
            <span className="text-lg font-medium tabular-nums tracking-tight">
              - {countdown}
            </span>
          </div>
        </div>
      </div>
      <div className="flex gap-2 pt-3 items-center justify-center">
        {PRAYERS.map(({ key, label, icon }) => (
          <PrayerCard
            key={key}
            icon={icon}
            nameTimePrayer={label}
            timePrayer={times[key]}
          />
        ))}
      </div>
    </div>
  );
}
