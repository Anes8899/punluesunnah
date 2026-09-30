import { Router } from "express";
import { getUstaz, listUstaz } from "../controllers/ustaz.controller";

const router: Router = Router();

router.get("/", listUstaz);
router.get("/:ustazId", getUstaz);

export default router;
