import { useQuery } from "@tanstack/react-query";
import type { PrayerKey, PrayerTimesResponse } from "@punluesunnah/shared-types";

export interface PrayerTimes {
  times: Record<PrayerKey | "sunset", Date>;
  hijri: string;
}

async function fetchPrayerTimes(lat?: number, lng?: number): Promise<PrayerTimes> {
  const params = new URLSearchParams();
  if (lat !== undefined) params.set("lat", String(lat));
  if (lng !== undefined) params.set("lng", String(lng));
  const res = await fetch(`/api/prayer-times?${params}`);
  if (!res.ok) throw new Error(`Failed to load prayer times: ${res.status}`);
  const data = (await res.json()) as PrayerTimesResponse;
  return {
    times: Object.fromEntries(
      Object.entries(data.times).map(([k, iso]) => [k, new Date(iso)]),
    ) as PrayerTimes["times"],
    hijri: data.hijri,
  };
}

const ORDER: PrayerKey[] = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"];

/** The first prayer still ahead today, or `none` once Isha has passed. */
export function nextPrayer(
  times: PrayerTimes["times"],
  now = new Date(),
): PrayerKey | "none" {
  return ORDER.find((k) => times[k] > now) ?? "none";
}

export function usePrayerTimes(lat?: number, lng?: number) {
  return useQuery({
    queryKey: ["prayerTimes", lat, lng],
    queryFn: () => fetchPrayerTimes(lat, lng),
    staleTime: Infinity,
    refetchInterval: (query) => {
      const times = query.state.data?.times;
      if (!times) return false;
      const now = new Date();
      const next = nextPrayer(times, now);

      if (next === "none") {
        // All prayers passed — refetch at midnight for next day
        const midnight = new Date();
        midnight.setHours(24, 0, 0, 0);
        return midnight.getTime() - now.getTime();
      }

      // Refetch 1 second after the next prayer time
      return times[next].getTime() - now.getTime() + 1000;
    },
  });
}
