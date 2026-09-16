// ── prayer-service ─────────────────────────────────────────────────────────

export type PrayerKey = "fajr" | "sunrise" | "dhuhr" | "asr" | "maghrib" | "isha";

/** Every time is an ISO-8601 string; the client turns them into Dates. */
export interface PrayerTimesResponse {
  date: string;
  coordinates: { lat: number; lng: number };
  times: Record<PrayerKey, string> & { sunset: string };
  /** `none` once Isha has passed for the day. */
  next: PrayerKey | "none";
  hijri: string;
}
