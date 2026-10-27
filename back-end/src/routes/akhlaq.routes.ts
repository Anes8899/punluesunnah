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

router.get("/akhlaq", listAkhlaq);
router.get("/akhlaq/references", listAkhlaqReferences);
router.get("/akhlaq/:virtueId", getAkhlaq);
router.post("/akhlaq", uploadBook, createAkhlaq);
router.put("/akhlaq/:virtueId", updateAkhlaq);
router.delete("/akhlaq/:virtueId", deleteAkhlaq);

export default router;
