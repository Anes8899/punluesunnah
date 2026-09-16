import "server-only";
import type { PrayerTimesResponse } from "@punluesunnah/shared-types";
import { mustGetJson, serviceUrl } from "./client";

export function getPrayerTimes(lat?: number, lng?: number): Promise<PrayerTimesResponse> {
  const params = new URLSearchParams();
  if (lat !== undefined) params.set("lat", String(lat));
  if (lng !== undefined) params.set("lng", String(lng));
  const query = params.size ? `?${params}` : "";
  // Times depend on "now" (the `next` field), so never cache.
  return mustGetJson(`${serviceUrl("PRAYER")}/prayer-times${query}`, { revalidate: 0 });
}
