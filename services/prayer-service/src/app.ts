import Fastify from "fastify";
import cors from "@fastify/cors";
import type { PrayerKey, PrayerTimesResponse } from "@punluesunnah/shared-types";
import { getPrayerTime } from "./prayerTimes.js";
import { getHijriDate } from "./hijri.js";

// Phnom Penh — the app's audience; used when the browser gives no location.
const DEFAULT_LAT = 11.562108;
const DEFAULT_LNG = 104.888535;

function parseCoord(raw: string | undefined, fallback: number, max: number): number {
  if (raw === undefined || raw === "") return fallback;
  const n = Number(raw);
  return Number.isFinite(n) && Math.abs(n) <= max ? n : NaN;
}

function toKey(name: string): PrayerKey | "none" {
  return name === "none" ? "none" : (name as PrayerKey);
}

export function buildApp() {
  const app = Fastify({ logger: true });
  app.register(cors, { origin: process.env.CORS_ORIGIN ?? false });

  app.get("/health", async () => ({ status: "ok", service: "prayer-service" }));

  app.get<{ Querystring: { lat?: string; lng?: string; date?: string } }>(
    "/prayer-times",
    async (req, reply): Promise<PrayerTimesResponse | void> => {
      const lat = parseCoord(req.query.lat, DEFAULT_LAT, 90);
      const lng = parseCoord(req.query.lng, DEFAULT_LNG, 180);
      if (Number.isNaN(lat) || Number.isNaN(lng)) {
        return reply.code(400).send({ error: "Invalid coordinates" });
      }
      const date = req.query.date ? new Date(req.query.date) : new Date();
      if (Number.isNaN(date.getTime())) {
        return reply.code(400).send({ error: "Invalid date" });
      }

      const t = getPrayerTime(lat, lng, date);
      return {
        date: date.toISOString(),
        coordinates: { lat, lng },
        times: {
          fajr: t.fajr.toISOString(),
          sunrise: t.sunrise.toISOString(),
          dhuhr: t.dhuhr.toISOString(),
          asr: t.asr.toISOString(),
          maghrib: t.maghrib.toISOString(),
          isha: t.isha.toISOString(),
          sunset: t.sunset.toISOString(),
        },
        next: toKey(t.nextPrayer()),
        hijri: getHijriDate(date),
      };
    },
  );

  app.get<{ Querystring: { date?: string } }>("/hijri", async (req, reply) => {
    const date = req.query.date ? new Date(req.query.date) : new Date();
    if (Number.isNaN(date.getTime())) return reply.code(400).send({ error: "Invalid date" });
    return { date: date.toISOString(), hijri: getHijriDate(date) };
  });

  return app;
}
