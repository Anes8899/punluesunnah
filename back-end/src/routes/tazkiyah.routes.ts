import { Router } from "express";
import { getTazkiyah, listTazkiyah } from "../controllers/tazkiyah.controller";

const router: Router = Router();

router.get("/", listTazkiyah);
router.get("/:topicId", getTazkiyah);

export default router;
