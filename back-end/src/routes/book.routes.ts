import { Router } from "express";
import { getBook, getLesson, listBooks } from "../controllers/book.controller";

const router: Router = Router();

// Aqidah, figh and arabic books share one shape. `?subject=aqidah|figh|arabic`
// filters the list; a book is addressed by its key (`${subject}-${id}`), since
// `id` alone collides between subjects.
router.get("/", listBooks);
router.get("/:bookKey", getBook);
router.get("/:bookKey/lessons/:lessonId", getLesson);

export default router;
