"use client";

import Image from "next/image";
import { Clock, MapPin } from "lucide-react";
import { mosque } from "@/app/assets/icon";
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
    <div className="rounded-lg bg-white shadow-md flex flex-col p-5">
      <div className="w-52 mx-auto flex flex-col justify-center items-center">
        <div className="flex flex-col items-center justify-center gap-2">
          <Image src={mosque} alt="mosque" className="w-8 h-8" />
          <h1 className="scroll-m-20 text-center text-lg font-extrabold tracking-tight text-balance">
            ម៉ោងសឡាត
          </h1>
        </div>
          <Badge className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
           <MapPin/>
            {addr?.town} · {addr?.state}
          </Badge>
        <div className="flex items-center justify-center gap-1 px-2">
          <p>{getHijriDate()}</p>
        </div>
      </div>
      <div className="bg-card border rounded-2xl px-5 py-4 flex justify-between items-center gap-1">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] text-muted-foreground uppercase tracking-widest font-medium">
            ថ្ងៃនេះ
          </span>
          <span className="text-[15px] font-medium">{KhmerDate}</span>
        </div>

        {/* <div className="w-px h-9 bg-border" /> */}

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-muted-foreground uppercase tracking-widest font-medium">
              បន្ទាប់
            </span>
            <span className="text-[11px] bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 px-2 py-0.5 rounded-full font-medium">
              {nextSalah}
            </span>
          </div>
          <div className="flex gap-1">
            <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
            <span className="text-base sm:text-lg w-5 font-medium tabular-nums tracking-tight">
              -{countdown}
            </span>
          </div>
        </div>
      </div>
      <div className="sm:flex-row flex flex-col gap-2 pt-3 items-center justify-center">
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
