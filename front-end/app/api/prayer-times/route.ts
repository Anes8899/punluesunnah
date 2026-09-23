import { NextResponse, type NextRequest } from "next/server";
import { getPrayerTimes } from "@/server/prayer";

// The prayer panel is a client component and the times depend on the browser's
// location, so it asks this route rather than rendering them on the server.
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  try {
    const times = getPrayerTimes(
      lat === null ? undefined : Number(lat),
      lng === null ? undefined : Number(lng),
    );
    return NextResponse.json(times, { headers: { "cache-control": "no-store" } });
  } catch (err) {
    if (err instanceof RangeError) {
      return NextResponse.json({ error: "Invalid coordinates" }, { status: 400 });
    }
    throw err;
  }
}
