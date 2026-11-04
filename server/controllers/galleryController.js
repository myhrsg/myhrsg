import { Gallery } from "../models/Gallery.js";
import ImageKit from "imagekit";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

export const getGalleryItems = async (req, res) => {
  try {
    const items = await Gallery.find().sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch gallery items" });
  }
};

export const createGalleryItem = async (req, res) => {
  try {
    const { caption } = req.body;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ error: "At least one image is required" });
    }

    const uploadPromises = files.map(async (file) => {
      // Upload to ImageKit
      const result = await imagekit.upload({
        file: file.buffer,
        fileName: file.originalname,
        folder: "/myHRSG/gallery",
      });

      // Save to Database
      const newItem = new Gallery({ 
        caption: caption || "Event Photo", // Use generic caption if multiple and none provided
        image: result.url 
      });
      return await newItem.save();
    });

    const savedItems = await Promise.all(uploadPromises);
    res.status(201).json(savedItems);
  } catch (err) {
    console.error("[CreateGalleryItem] Error:", err.message);
    res.status(500).json({ error: "Failed to create gallery items" });
  }
};

export const deleteGalleryItem = async (req, res) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Gallery item deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete gallery item" });
  }
};

export const updateGalleryItem = async (req, res) => {
  try {
    const { caption } = req.body;
    const item = await Gallery.findByIdAndUpdate(req.params.id, { caption }, { new: true });
    if (!item) return res.status(404).json({ error: "Gallery item not found" });
    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ error: "Failed to update gallery item" });
  }
};
