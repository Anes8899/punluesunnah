import { Router } from "express";
import { getHadith, listHadiths } from "../controllers/hadith.controller";

const router: Router = Router();

router.get("/hadiths", listHadiths);
router.get("/hadiths/:hadithId", getHadith);

export default router;
