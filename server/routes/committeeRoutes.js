import { Router } from "express";
import { getCommittee, createCommitteeMember, updateCommitteeMember, deleteCommitteeMember } from "../controllers/committeeController.js";
import { isAdmin } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = Router();

router.get("/", getCommittee);
router.post("/", isAdmin, upload.single("image"), createCommitteeMember);
router.put("/:id", isAdmin, upload.single("image"), updateCommitteeMember);
router.delete("/:id", isAdmin, deleteCommitteeMember);

export default router;
