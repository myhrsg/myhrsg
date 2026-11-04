import { Router } from "express";
import {
  createArticle,
  getArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
} from "../controllers/articleController.js";
import { isAdmin } from "../middleware/authMiddleware.js";

const router = Router();

router.route("/")
  .get(getArticles)
  .post(isAdmin, createArticle);

router.route("/:id")
  .get(getArticleById)
  .put(isAdmin, updateArticle)
  .delete(isAdmin, deleteArticle);

export default router;
