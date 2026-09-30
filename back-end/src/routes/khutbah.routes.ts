import { Router } from "express";
import {
  getKhutbah,
  listKhutbahTopics,
  listKhutbahs,
} from "../controllers/khutbah.controller";

const router: Router = Router();

router.get("/", listKhutbahs);
router.get("/topics", listKhutbahTopics);
router.get("/:khutbahId", getKhutbah);

export default router;
