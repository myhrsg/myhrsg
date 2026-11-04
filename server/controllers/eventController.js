import { Event } from "../models/Event.js";
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

const imagekit = new ImageKit(ikConfig);

export const getEvents = async (req, res) => {
  try {
    const now = new Date();

    // Automatically transition upcoming events to past if date crosses
    // Using updateMany is much more efficient than a loop of saves on serverless
    try {
      await Event.updateMany(
        { type: "upcoming", date: { $lt: now } },
        { $set: { type: "past" } }
      );
    } catch (syncErr) {
      console.error("[GetEvents] Auto-sync failed:", syncErr.message);
      // Continue to return events even if sync fails
    }

    const events = await Event.find().sort({ date: -1 });
    res.json(events || []);
  } catch (error) {
    console.error("[GetEvents] Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createEvent = async (req, res) => {
  try {
    const { title, mentorName, location, date, type, registrationUrl } = req.body;
    let imageUrls = [];

    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) =>
        imagekit.upload({
          file: file.buffer,
          fileName: `${Date.now()}-${file.originalname}`,
          folder: "/events",
        })
      );
      const results = await Promise.all(uploadPromises);
      imageUrls = results.map((result) => result.url);
    }

    const newEvent = new Event({
      title,
      mentorName,
      location,
      date,
      type,
      images: imageUrls,
      registrationUrl,
      createdBy: req.user?._id,
    });

    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { title, mentorName, location, date, type, existingImages, registrationUrl } = req.body;
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });

    let updatedImages = Array.isArray(existingImages) ? existingImages : [existingImages].filter(Boolean);

    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) =>
        imagekit.upload({
          file: file.buffer,
          fileName: `${Date.now()}-${file.originalname}`,
          folder: "/events",
        })
      );
      const results = await Promise.all(uploadPromises);
      const newUrls = results.map((result) => result.url);
      updatedImages = [...updatedImages, ...newUrls];
    }

    event.title = title || event.title;
    event.mentorName = mentorName || event.mentorName;
    event.location = location || event.location;
    event.date = date || event.date;
    event.type = type || event.type;
    event.images = updatedImages;
    event.registrationUrl = registrationUrl !== undefined ? registrationUrl : event.registrationUrl;

    await event.save();
    res.json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    // Also delete associated comments
    await Comment.deleteMany({ eventId: req.params.id });
    res.json({ message: "Event and associated comments deleted" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
