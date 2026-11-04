import { Router } from "express";
import * as sponsorController from "../controllers/sponsorController.js";

const router = Router();

router.post("/", sponsorController.createSponsorInquiry);

export default router;
