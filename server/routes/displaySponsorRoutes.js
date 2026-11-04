import { Router } from "express";
import * as displaySponsorController from "../controllers/displaySponsorController.js";
import { isAdmin } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = Router();

// Public route to get sponsors for display
router.get("/", displaySponsorController.getDisplaySponsors);

// Admin routes for managing sponsors
router.post("/", isAdmin, upload.single("logo"), displaySponsorController.createDisplaySponsor);
router.put("/:id", isAdmin, upload.single("logo"), displaySponsorController.updateDisplaySponsor);
router.delete("/:id", isAdmin, displaySponsorController.deleteDisplaySponsor);

export default router;     
