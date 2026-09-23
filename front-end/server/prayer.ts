import "server-only";
import type { PrayerKey, PrayerTimesResponse } from "@/types";
import { getPrayerTime } from "./prayerTimes";
import { getHijriDate } from "./hijri";

// Phnom Penh — the app's audience; used when the browser gives no location.
const DEFAULT_LAT = 11.562108;
const DEFAULT_LNG = 104.888535;

function coord(value: number | undefined, fallback: number, max: number): number {
  if (value === undefined || Number.isNaN(value)) return fallback;
  if (!Number.isFinite(value) || Math.abs(value) > max) {
    throw new RangeError(`Coordinate out of range: ${value}`);
  }
  return value;
}

/**
 * Computed in-process on every call: the `next` field depends on "now", so
 * this must never be cached.
 */
export function getPrayerTimes(
  lat?: number,
  lng?: number,
  date: Date = new Date(),
): PrayerTimesResponse {
  const latitude = coord(lat, DEFAULT_LAT, 90);
  const longitude = coord(lng, DEFAULT_LNG, 180);
  if (Number.isNaN(date.getTime())) throw new RangeError("Invalid date");

  const t = getPrayerTime(latitude, longitude, date);
  return {
    date: date.toISOString(),
    coordinates: { lat: latitude, lng: longitude },
    times: {
      fajr: t.fajr.toISOString(),
      sunrise: t.sunrise.toISOString(),
      dhuhr: t.dhuhr.toISOString(),
      asr: t.asr.toISOString(),
      maghrib: t.maghrib.toISOString(),
      isha: t.isha.toISOString(),
      sunset: t.sunset.toISOString(),
    },
    next: t.nextPrayer() as PrayerKey | "none",
    hijri: getHijriDate(date),
  };
}

export { getHijriDate };
