import { PRAYERS } from "@/app/components/dashboard/PrayerPanel";
import { PrayerTimes } from "./getPrayerTime";
import { timeStringToDate } from "./timeStringToDate";

export function getNextPrayer(time: PrayerTimes) {
  const now = new Date();
  for (const prayer of PRAYERS) {
    const prayerDate = timeStringToDate(time[prayer.key]);
    if (prayerDate > now) {
      return { key: prayer.key, time: prayerDate };
    }
  }
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const fajrTime = timeStringToDate(time["Fajr"]);
  fajrTime.setDate(fajrTime.getDate() + 1);

  return { key: "Fajr" as const, time: fajrTime };
}
