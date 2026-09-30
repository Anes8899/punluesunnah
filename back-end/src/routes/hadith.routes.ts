import { Router } from "express";
import { getHadith, listHadiths } from "../controllers/hadith.controller";

const router: Router = Router();

router.get("/", listHadiths);
router.get("/:hadithId", getHadith);

export default router;
