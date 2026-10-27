import { Router } from "express";
import { getTazkiyah, listTazkiyah } from "../controllers/tazkiyah.controller";

const router: Router = Router();

router.get("/tazkiyah", listTazkiyah);
router.get("/tazkiyah/:topicId", getTazkiyah);

export default router;
