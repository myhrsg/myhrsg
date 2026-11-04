import { Router } from "express";
import {
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion
} from "../controllers/quizController.js";
import { isAdmin } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", getQuestions);
router.post("/", isAdmin, createQuestion);
router.put("/:id", isAdmin, updateQuestion);
router.delete("/:id", isAdmin, deleteQuestion);

export default router;
