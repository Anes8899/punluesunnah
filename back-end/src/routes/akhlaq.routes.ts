import { Router } from "express";
import {
  createAkhlaq,
  deleteAkhlaq,
  getAkhlaq,
  listAkhlaq,
  listAkhlaqReferences,
  updateAkhlaq,
} from "../controllers/akhlaq.controller";
import { uploadBook } from "../middleware/uploadBook";

const router: Router = Router();

router.get("/", listAkhlaq);
router.get("/references", listAkhlaqReferences);
router.get("/:virtueId", getAkhlaq);
router.post("/", uploadBook, createAkhlaq);
router.put("/:virtueId", updateAkhlaq);
router.delete("/:virtueId", deleteAkhlaq);

export default router;
