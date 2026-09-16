import { NextResponse, type NextRequest } from "next/server";
import { getPrayerTimes } from "@punluesunnah/api-client/prayer";

// The browser cannot reach the services directly, so the prayer panel asks
// this route and it forwards to prayer-service.
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const times = await getPrayerTimes(
    lat === null ? undefined : Number(lat),
    lng === null ? undefined : Number(lng),
  );
  return NextResponse.json(times, { headers: { "cache-control": "no-store" } });
}
