"use client";

import Image from "next/image";
import { AspectRatio } from "../ui/aspect-ratio";
import { MapPin } from "lucide-react";
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
  { key: "Asr", label: "Asr", icon: "cloudy"},
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
  const [countdown, setCountdown] = useState('');
  const [nextPrayer, setNextPrayer] = useState<{ key: PrayerKey; label: string } | null>(null);


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
      <div
        className="rounded-lg bg-white shadow-md flex flex-col p-5"
      >
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
        <div className="flex justify-between">
          <div className="flex flex-col">
            <p>ថ្ងៃនេះ</p>
            <p>{KhmerDate}</p>
          </div>
          <div className="flex flex-col">
            <p>បន្ទាប់: {nextPrayer?.label}</p>
            <p>-{countdown}</p>
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
