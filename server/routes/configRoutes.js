import { Router } from "express";
import { getConfig, updateConfig } from "../controllers/configController.js";
import { isAdmin } from "../middleware/authMiddleware.js";

const router = Router();

router.route("/:key")
  .get(getConfig)
  .put(isAdmin, updateConfig);

export default router;
