import {
  Coordinates,
  CalculationMethod,
  PrayerTimes,
  Madhab,
  PolarCircleResolution,
} from "adhan";

export interface SalahName {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

const HCIRAC_ADJUSTMENTS = {
  fajr: -7,
  sunrise: -2,
  dhuhr: -1,
  asr: 0,
  maghrib: 1,
  isha: 5,
} as const;

export function getPrayerTime(
  lat: number = 11.579375,
  lng: number = 104.913811,
) {
  const coordinates = new Coordinates(lat, lng);
  const params = CalculationMethod.MuslimWorldLeague();
  params.polarCircleResolution = PolarCircleResolution.AqrabBalad;
  params.madhab = Madhab.Shafi;
  Object.assign(params.adjustments, HCIRAC_ADJUSTMENTS);

  return new PrayerTimes(coordinates, new Date(), params);
}
