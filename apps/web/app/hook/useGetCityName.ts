import { useQuery } from "@tanstack/react-query";

interface CityResult {
  state: string | null;
  town: string | null;
  display: string; // fallback-safe label for UI
}

async function getCityName(lat: number, lng: number): Promise<CityResult> {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;

  const res = await fetch(url, {
    headers: {
      "Accept-Language": "km", // Khmer labels
      "User-Agent": "punluesunnah.com/1.0", // Nominatim requires this
    },
  });

  if (!res.ok) throw new Error(`Nominatim error: ${res.status}`);

  const data = await res.json();
  const addr = data.address ?? {};

  const town =
    addr.city ??
    addr.town ??
    addr.village ??
    addr.suburb ??
    addr.county ??
    null;

  const state = addr.state ?? null;

  return {
    state,
    town,
    display: town ?? state ?? data.display_name ?? "Unknown location",
  };
}

export function useGetCityName(
  lat: number = 11.562108,
  lng: number = 104.888535,
) {
  return useQuery({
    queryKey: ["city-name", lat, lng],
    queryFn: () => getCityName(lat, lng),
    enabled: !!lat && !!lng, // only fetch when coords are available
  });
}
