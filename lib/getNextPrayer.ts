import { PrayerKey, PRAYERS } from "@/app/components/dashboard/PrayerPanel";
import { PrayerTimes } from "./getPrayerTime";
import { timeStringToDate } from "./timeStringToDate";

export function getNextPrayer(
  time: PrayerTimes,
): { key: PrayerKey; label: string; time: Date } | null {
  const now = new Date();
  for (const prayer of PRAYERS) {
    const prayerDate = timeStringToDate(time[prayer.key]);
    if (prayerDate > now) {
      return { key: prayer.key, label: prayer.label, time: prayerDate };
    }
  }
  return null;
}
