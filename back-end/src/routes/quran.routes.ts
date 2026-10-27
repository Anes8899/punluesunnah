import { Router } from "express";
import { getVerses, listChapters } from "../controllers/quran.controller";

const router: Router = Router();

router.get("/quran/chapters", listChapters);
router.get("/quran/chapters/:chapterId/verses", getVerses);

export default router;
