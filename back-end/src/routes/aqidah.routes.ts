import { Router } from "express";
import {
  createAqidah,
  deleteAqidah,
  getAqidah,
  getAqidahChapter,
  listAqidah,
  updateAqidah,
} from "../controllers/aqidah.controller";
import { uploadBook } from "../middleware/uploadBook";

const router: Router = Router();

router.get("/aqidah", listAqidah);
router.get("/aqidah/:aqidahId", getAqidah);
router.get("/aqidah/:aqidahId/chapters/:order", getAqidahChapter);
router.post("/aqidah", uploadBook, createAqidah);
router.put("/aqidah/:aqidahId", updateAqidah);
router.delete("/aqidah/:aqidahId", deleteAqidah);

export default router;
