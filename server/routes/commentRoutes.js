import { Router } from "express";
import { createComment, getCommentsByChapter } from "../controllers/commentController.js";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

const router = Router();

// Middleware to just check if user is logged in (anyone with a token)
const isUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Access denied. No token provided." });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token." });
  }
};

router.get("/:chapterId", getCommentsByChapter);
router.post("/", isUser, createComment);

export default router;
