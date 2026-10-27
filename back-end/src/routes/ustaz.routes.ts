import { Router } from "express";
import { getUstaz, listUstaz } from "../controllers/ustaz.controller";

const router: Router = Router();

router.get("/ustaz", listUstaz);
router.get("/ustaz/:ustazId", getUstaz);

export default router;
