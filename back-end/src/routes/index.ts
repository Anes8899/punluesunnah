import { Router } from "express";
import akhlaqRoutes from "./akhlaq.routes";
import aqidahRoutes from "./aqidah.routes";
import bookRoutes from "./book.routes";
import duaRoutes from "./dua.routes";
import hadithRoutes from "./hadith.routes";
import healthRoutes from "./health.routes";
import khutbahRoutes from "./khutbah.routes";
import prayerRoutes from "./prayer.routes";
import quranRoutes from "./quran.routes";
import tazkiyahRoutes from "./tazkiyah.routes";
import ustazRoutes from "./ustaz.routes";

const router: Router = Router();

router.use("/", healthRoutes);
router.use("/", hadithRoutes);
router.use("/", duaRoutes);
router.use("/", khutbahRoutes);
router.use("/", tazkiyahRoutes);
router.use("/", akhlaqRoutes);
router.use("/", aqidahRoutes);
router.use("/", bookRoutes);
router.use("/", ustazRoutes);
router.use("/", quranRoutes);
router.use("/", prayerRoutes);

export default router;
