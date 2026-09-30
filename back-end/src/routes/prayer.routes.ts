import { Router } from "express";
import { getHijriDate, getPrayerTimes } from "../controllers/prayer.controller";

const router: Router = Router();

// `?lat=&lng=` — times depend on the caller's location.
router.get("/", getPrayerTimes);
router.get("/hijri", getHijriDate);

export default router;
