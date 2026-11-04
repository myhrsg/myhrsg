import { Router } from "express";
import authRoutes from "./authRoutes.js";
import memberRoutes from "./memberRoutes.js";
import eventRoutes from "./eventRoutes.js";
import sponsorRoutes from "./sponsorRoutes.js";
import imagekitRoutes from "./imagekitRoutes.js";
import commentRoutes from "./commentRoutes.js";
import partnerRoutes from "./partnerRoutes.js";
import mentorRoutes from "./mentorRoutes.js";
import committeeRoutes from "./committeeRoutes.js";
import quizRoutes from "./quizRoutes.js";
import contactRoutes from "./contactRoutes.js";
import displaySponsorRoutes from "./displaySponsorRoutes.js";
import cronRoutes from "./cronRoutes.js";
import articleRoutes from "./articleRoutes.js";
import configRoutes from "./configRoutes.js";
import testimonialRoutes from "./testimonialRoutes.js";

const router = Router();

router.use("/auth", authRoutes);

// Maintain compatibility with old API
router.use("/register", authRoutes);
router.use("/login", authRoutes);
router.use("/members", memberRoutes);
router.use("/events", eventRoutes);
router.use("/sponsors", sponsorRoutes);
router.use("/imagekit", imagekitRoutes);
router.use("/mentors", mentorRoutes);
router.use("/committee", committeeRoutes);

import galleryRoutes from "./galleryRoutes.js";
import whatsappCommunityRoutes from "./whatsappCommunityRoutes.js";

// New Features & Feedback System
router.use("/comments", commentRoutes);
router.use("/partners", partnerRoutes);
router.use("/quiz", quizRoutes);
router.use("/contact", contactRoutes);
router.use("/display-sponsors", displaySponsorRoutes);
router.use("/gallery", galleryRoutes);
router.use("/whatsapp-communities", whatsappCommunityRoutes);
router.use("/articles", articleRoutes);
router.use("/config", configRoutes);
router.use("/testimonials", testimonialRoutes);

// Cron Jobs (Vercel scheduled)
router.use("/cron", cronRoutes);

export default router;
