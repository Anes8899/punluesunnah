import { Router } from "express";
import { getDua, listDuaCategories, listDuas } from "../controllers/dua.controller";

const router: Router = Router();

// `?category=` filters the list; `/categories/:slug` is the same filter as a path.
router.get("/", listDuas);
router.get("/categories", listDuaCategories);
router.get("/categories/:slug", listDuas);
router.get("/:duaId", getDua);

export default router;
