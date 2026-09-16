import { useQuery } from "@tanstack/react-query";

function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    });
  });
}

export function useGetCurrentLocation() {
  return useQuery({
    queryKey: ["current-location"],
    queryFn: getCurrentPosition,
  });
}
