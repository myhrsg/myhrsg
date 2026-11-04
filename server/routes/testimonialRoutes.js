import { Router } from "express";
import * as testimonialController from "../controllers/testimonialController.js";
import { isAdmin } from "../middleware/authMiddleware.js";
import { uploadMedia } from "../middleware/uploadMiddleware.js";

const router = Router();

// Public route to get testimonials
router.get("/", testimonialController.getTestimonials);

// Admin routes to manage testimonials
router.post("/", isAdmin, uploadMedia.single("thumbnail"), testimonialController.createTestimonial);
router.put("/:id", isAdmin, uploadMedia.single("thumbnail"), testimonialController.updateTestimonial);
router.delete("/:id", isAdmin, testimonialController.deleteTestimonial);

export default router;
