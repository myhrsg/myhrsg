import { Router } from "express";
import { getWhatsAppCommunities, createWhatsAppCommunity, updateWhatsAppCommunity, deleteWhatsAppCommunity, reorderWhatsAppCommunities } from "../controllers/whatsappCommunityController.js";
import { isAdmin } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = Router();
router.get("/", getWhatsAppCommunities);
router.post("/", isAdmin, upload.single("qrImage"), createWhatsAppCommunity);
router.put("/reorder", isAdmin, reorderWhatsAppCommunities);
router.put("/:id", isAdmin, upload.single("qrImage"), updateWhatsAppCommunity);
router.delete("/:id", isAdmin, deleteWhatsAppCommunity);
export default router;
