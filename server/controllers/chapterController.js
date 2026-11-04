import { Chapter } from "../models/Chapter.js";
import { Comment } from "../models/Comment.js";
import ImageKit from "imagekit";
import dotenv from "dotenv";

dotenv.config();

// ImageKit Diagnostics
const ikConfig = {
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
};

console.log("[ImageKit] Initializing with config:", {
  publicKey: ikConfig.publicKey ? "present" : "MISSING",
  privateKey: ikConfig.privateKey ? "present" : "MISSING",
  urlEndpoint: ikConfig.urlEndpoint ? ikConfig.urlEndpoint : "MISSING"
});

if (!ikConfig.publicKey || !ikConfig.privateKey || !ikConfig.urlEndpoint) {
  console.warn("[ImageKit] Critical configuration missing. Uploads will fail.");
}

const imagekit = new ImageKit(ikConfig);

export const getChapters = async (req, res) => {
  try {
    const chapters = await Chapter.find().sort({ date: -1 });
    res.json(chapters);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getChapterById = async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.id);
    if (!chapter) return res.status(404).json({ error: "Chapter not found" });
    res.json(chapter);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createChapter = async (req, res) => {
  try {
    const { title, mentorName, location, date, type } = req.body;
    let imageUrls = [];

    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) =>
        imagekit.upload({
          file: file.buffer,
          fileName: `${Date.now()}-${file.originalname}`,
          folder: "/chapters",
        })
      );
      const results = await Promise.all(uploadPromises);
      imageUrls = results.map((result) => result.url);
    }

    const newChapter = new Chapter({
      title,
      mentorName,
      location,
      date,
      type,
      images: imageUrls,
      createdBy: req.user?._id,
    });

    await newChapter.save();
    res.status(201).json(newChapter);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateChapter = async (req, res) => {
  try {
    const { title, mentorName, location, date, type, existingImages } = req.body;
    const chapter = await Chapter.findById(req.params.id);
    if (!chapter) return res.status(404).json({ error: "Chapter not found" });

    let updatedImages = Array.isArray(existingImages) ? existingImages : [existingImages].filter(Boolean);

    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) =>
        imagekit.upload({
          file: file.buffer,
          fileName: `${Date.now()}-${file.originalname}`,
          folder: "/chapters",
        })
      );
      const results = await Promise.all(uploadPromises);
      const newUrls = results.map((result) => result.url);
      updatedImages = [...updatedImages, ...newUrls];
    }

    chapter.title = title || chapter.title;
    chapter.mentorName = mentorName || chapter.mentorName;
    chapter.location = location || chapter.location;
    chapter.date = date || chapter.date;
    chapter.type = type || chapter.type;
    chapter.images = updatedImages;

    await chapter.save();
    res.json(chapter);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteChapter = async (req, res) => {
  try {
    await Chapter.findByIdAndDelete(req.params.id);
    // Also delete associated comments
    await Comment.deleteMany({ chapterId: req.params.id });
    res.json({ message: "Chapter and associated comments deleted" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
