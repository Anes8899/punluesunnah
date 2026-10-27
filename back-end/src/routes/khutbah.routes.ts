import { Router } from "express";
import {
  getKhutbah,
  listKhutbahTopics,
  listKhutbahs,
} from "../controllers/khutbah.controller";

const router: Router = Router();

router.get("/khutbahs", listKhutbahs);
router.get("/khutbahs/topics", listKhutbahTopics);
router.get("/khutbahs/:khutbahId", getKhutbah);

export default router;
