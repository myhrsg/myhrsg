import { Router } from "express";
import { getAuthParams } from "../controllers/imagekitController.js";

const router = Router();

router.get("/auth", getAuthParams);

export default router;
