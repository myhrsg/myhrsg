import { Router } from "express";
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
} from "../controllers/eventController.js";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import multer from "multer";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

const isAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Access denied. No token provided." });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admin role required." });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token." });
  }
};

router.get("/", getEvents);
router.get("/:id", getEventById);
router.post("/", isAdmin, upload.array("images", 20), createEvent);
router.put("/:id", isAdmin, upload.array("images", 20), updateEvent);
router.delete("/:id", isAdmin, deleteEvent);

export default router;