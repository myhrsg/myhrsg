import { Router } from "express";
import { sendBirthdayWishes } from "../controllers/birthdayController.js";

const router = Router();

// Triggered daily by Vercel Cron at 9:00 AM IST
router.get("/birthday", sendBirthdayWishes);

export default router;
