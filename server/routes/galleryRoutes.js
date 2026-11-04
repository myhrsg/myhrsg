import { Router } from "express";
import { getGalleryItems, createGalleryItem, deleteGalleryItem, updateGalleryItem } from "../controllers/galleryController.js";
import { isAuth, isAdmin } from "../middleware/authMiddleware.js";
import multer from "multer";

const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/", getGalleryItems);
router.post("/", isAuth, isAdmin, upload.array("images", 20), createGalleryItem);
router.put("/:id", isAuth, isAdmin, updateGalleryItem);
router.delete("/:id", isAuth, isAdmin, deleteGalleryItem);

export default router;