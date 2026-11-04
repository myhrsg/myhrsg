import { Testimonial } from "../models/Testimonial.js";
import { User } from "../models/User.js";
import { DisplaySponsor } from "../models/DisplaySponsor.js";
import ImageKit from "imagekit";
import dotenv from "dotenv";

dotenv.config();

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

export const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find()
      .sort({ order: 1, createdAt: -1 });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createTestimonial = async (req, res) => {
  try {
    const { type, name, designation, link, thumbnail, order } = req.body;
    let thumbnailUrl = thumbnail || "";

    if (req.file) {
      const result = await imagekit.upload({
        file: req.file.buffer,
        fileName: `${Date.now()}-${req.file.originalname}`,
        folder: "/sponsors",
      });
      thumbnailUrl = result.url;
    }

    if (!type) {
      return res.status(400).json({ error: "Type is required" });
    }
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }
    if (!link) {
      return res.status(400).json({ error: "Link URL is required" });
    }

    const newTestimonial = new Testimonial({
      type,
      name,
      designation,
      link,
      thumbnail: thumbnailUrl,
      order: order || 0
    });

    await newTestimonial.save();
    
    res.status(201).json(newTestimonial);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, name, designation, link, thumbnail, order } = req.body;
    
    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      return res.status(404).json({ error: "Testimonial not found" });
    }

    let thumbnailUrl = testimonial.thumbnail;

    if (req.file) {
      const result = await imagekit.upload({
        file: req.file.buffer,
        fileName: `${Date.now()}-${req.file.originalname}`,
        folder: "/sponsors",
      });
      thumbnailUrl = result.url;
    } else if (thumbnail !== undefined) {
      thumbnailUrl = thumbnail;
    }

    testimonial.type = type || testimonial.type;
    testimonial.name = name || testimonial.name;
    testimonial.designation = designation !== undefined ? designation : testimonial.designation;
    testimonial.link = link || testimonial.link;
    testimonial.thumbnail = thumbnailUrl;
    testimonial.order = order !== undefined ? order : testimonial.order;

    await testimonial.save();
    res.json(testimonial);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Testimonial.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: "Testimonial not found" });
    }
    res.json({ message: "Testimonial deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
