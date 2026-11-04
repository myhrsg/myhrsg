import { Mentor } from "../models/Mentor.js";
import ImageKit from "imagekit";
import dotenv from "dotenv";

dotenv.config();

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

export const getMentors = async (req, res) => {
  try {
    const mentors = await Mentor.find().sort({ createdAt: -1 });
    res.json(mentors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createMentor = async (req, res) => {
  try {
    const { name, city, linkedinUrl } = req.body;
    let photoUrl = "";

    if (req.file) {
      const result = await imagekit.upload({
        file: req.file.buffer,
        fileName: `${Date.now()}-${req.file.originalname}`,
        folder: "/mentors",
      });
      photoUrl = result.url;
    }

    const newMentor = new Mentor({
      name,
      city,
      linkedinUrl,
      photo: photoUrl,
    });

    await newMentor.save();
    res.status(201).json(newMentor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


export const updateMentor = async (req, res) => {
  try {
    const { name, city, linkedinUrl } = req.body;
    const mentor = await Mentor.findById(req.params.id);
    if (!mentor) return res.status(404).json({ error: "Mentor not found" });

    if (req.file) {
      const result = await imagekit.upload({
        file: req.file.buffer,
        fileName: `${Date.now()}-${req.file.originalname}`,
        folder: "/mentors",
      });
      mentor.photo = result.url;
    }

    mentor.name = name || mentor.name;
    mentor.city = city || mentor.city;
    mentor.linkedinUrl = linkedinUrl || mentor.linkedinUrl;

    await mentor.save();
    res.json(mentor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteMentor = async (req, res) => {
  try {
    await Mentor.findByIdAndDelete(req.params.id);
    res.json({ message: "Mentor deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
