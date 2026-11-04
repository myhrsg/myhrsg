import { Router } from "express";
import { getMentors, createMentor, updateMentor, deleteMentor } from "../controllers/mentorController.js";
import { isAdmin } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = Router();

router.get("/", getMentors);
router.post("/", isAdmin, upload.single("photo"), createMentor);
router.put("/:id", isAdmin, upload.single("photo"), updateMentor);
router.delete("/:id", isAdmin, deleteMentor);

export default router;
