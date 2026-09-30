import { Router } from "express";
import { getVerses, listChapters } from "../controllers/quran.controller";

const router: Router = Router();

router.get("/chapters", listChapters);
router.get("/chapters/:chapterId/verses", getVerses);

export default router;
