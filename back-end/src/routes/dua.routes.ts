import { Router } from "express";
import { getDua, listDuaCategories, listDuas } from "../controllers/dua.controller";

const router: Router = Router();

// `?category=` filters the list; `/categories/:slug` is the same filter as a path.
router.get("/duas", listDuas);
router.get("/duas/categories", listDuaCategories);
router.get("/duas/categories/:slug", listDuas);
router.get("/duas/:duaId", getDua);

export default router;
