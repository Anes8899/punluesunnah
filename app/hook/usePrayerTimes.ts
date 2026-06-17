import { getPrayerTime } from '@/lib/getPrayerTime';
import { useQuery } from '@tanstack/react-query';

export function usePrayerTimes(lat?: number, lng?: number) {
  return useQuery({
    queryKey: ['prayerTimes', lat, lng],
    queryFn: () => getPrayerTime(lat, lng),
    staleTime: Infinity,
    refetchInterval: () => {
      const times = getPrayerTime(lat, lng);
      const now = new Date();

      const prayers = [
        times.fajr,
        times.sunrise,
        times.dhuhr,
        times.asr,
        times.maghrib,
        times.isha,
      ];

      // Find the next upcoming prayer
      const next = prayers.find((t) => t > now);

      if (!next) {
        // All prayers passed — refetch at midnight for next day
        const midnight = new Date();
        midnight.setHours(24, 0, 0, 0);
        return midnight.getTime() - now.getTime();
      }

      // Refetch 1 second after the next prayer time
      return next.getTime() - now.getTime() + 1000;
    },
  });
}