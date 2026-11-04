import { isAdmin, isMainAdmin } from "../middleware/authMiddleware.js";
import { Router } from "express";
import * as memberController from "../controllers/memberController.js";

const router = Router();

router.get("/stats", isAdmin, memberController.getAdminStats);
router.get("/", isAdmin, memberController.getMembers);
router.post("/mass-mail", isAdmin, memberController.sendMassMail);

router.put("/:id/status", isAdmin, memberController.updateMemberStatus);
router.put("/:id/undo", isAdmin, memberController.undoMemberStatus);
router.put("/:id/promote", isMainAdmin, memberController.promoteAdmin);
router.patch("/:id/role", isMainAdmin, memberController.updateUserRole);
router.delete("/:id", isAdmin, memberController.deleteMember);

export default router;
