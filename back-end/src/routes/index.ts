import { Router } from "express";
import akhlaqRoutes from "./akhlaq.routes";
import bookRoutes from "./book.routes";
import duaRoutes from "./dua.routes";
import hadithRoutes from "./hadith.routes";
import khutbahRoutes from "./khutbah.routes";
import prayerRoutes from "./prayer.routes";
import quranRoutes from "./quran.routes";
import tazkiyahRoutes from "./tazkiyah.routes";
import ustazRoutes from "./ustaz.routes";

const router: Router = Router();

router.use("/hadiths", hadithRoutes);
router.use("/duas", duaRoutes);
router.use("/khutbahs", khutbahRoutes);
router.use("/tazkiyah", tazkiyahRoutes);
router.use("/akhlaq", akhlaqRoutes);
router.use("/books", bookRoutes);
router.use("/ustaz", ustazRoutes);
router.use("/quran", quranRoutes);
router.use("/prayer-times", prayerRoutes);

export default router;
