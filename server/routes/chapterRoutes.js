import { Router } from "express";
import { 
  getChapters, 
  getChapterById, 
  createChapter, 
  updateChapter, 
  deleteChapter 
} from "../controllers/chapterController.js";
import { isAdmin } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = Router();

router.get("/", getChapters);
router.get("/:id", getChapterById);
router.post("/", isAdmin, upload.array("images", 10), createChapter);
router.put("/:id", isAdmin, upload.array("images", 10), updateChapter);
router.delete("/:id", isAdmin, deleteChapter);

export default router;
