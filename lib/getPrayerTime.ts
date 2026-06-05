export interface PrayerTimes {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

export async function getPrayerTime(
  lat: number = 11.5564,
  lng: number = 104.9282,
  date: Date = new Date(),
): Promise<PrayerTimes> {
  const day = date.getDay();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const url = `https://api.aladhan.com/v1/timings/${day}-${month}-${year}?latitude=${lat}&longitude=${lng}&method=11`;
  try {
    const res = await fetch(url);
    const result = await res.json();
    return result.data.timings;
  } catch (err) {
    throw err;
  }
}
