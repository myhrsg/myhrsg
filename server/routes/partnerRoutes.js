import { Router } from "express";
import { createPartnerInquiry } from "../controllers/partnerController.js";

const router = Router();

router.post("/", createPartnerInquiry);

export default router;
