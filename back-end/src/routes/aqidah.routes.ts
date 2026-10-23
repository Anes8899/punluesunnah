import { Router } from "express";
import {
  createAqidah,
  deleteAqidah,
  getAqidah,
  listAqidah,
  updateAqidah,
} from "../controllers/aqidah.controller";
import { uploadBook } from "../middleware/uploadBook";

const router: Router = Router();

router.get("/", listAqidah);
router.get("/:aqidahId", getAqidah);
router.post("/", uploadBook, createAqidah);
router.put("/:aqidahId", updateAqidah);
router.delete("/:aqidahId", deleteAqidah);

export default router;
