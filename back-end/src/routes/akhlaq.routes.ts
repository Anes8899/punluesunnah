import { Router } from "express";
import {
  createAkhlaq,
  deleteAkhlaq,
  getAkhlaq,
  listAkhlaq,
  listAkhlaqReferences,
  updateAkhlaq,
} from "../controllers/akhlaq.controller";

const router: Router = Router();

router.get("/", listAkhlaq);
router.get("/references", listAkhlaqReferences);
router.get("/:virtueId", getAkhlaq);
router.post("/", createAkhlaq);
router.put("/:virtueId", updateAkhlaq);
router.delete("/:virtueId", deleteAkhlaq);

export default router;
