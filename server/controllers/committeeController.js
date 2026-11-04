import { Committee } from "../models/Committee.js";
import ImageKit from "imagekit";
import dotenv from "dotenv";

dotenv.config();

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

export const getCommittee = async (req, res) => {
  try {
    const committee = await Committee.find().sort({ createdAt: -1 });
    res.json(committee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createCommitteeMember = async (req, res) => {
  try {
    const { name, role, city, linkedinUrl } = req.body;
    let imageUrl = "";

    if (req.file) {
      const result = await imagekit.upload({
        file: req.file.buffer,
        fileName: `${Date.now()}-${req.file.originalname}`,
        folder: "/committee",
      });
      imageUrl = result.url;
    }

    const newMember = new Committee({
      name,
      role,
      city,
      linkedinUrl,
      image: imageUrl,
    });

    await newMember.save();
    res.status(201).json(newMember);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateCommitteeMember = async (req, res) => {
  try {
    const { name, role, city, linkedinUrl } = req.body;
    const member = await Committee.findById(req.params.id);
    if (!member) return res.status(404).json({ error: "Committee member not found" });

    if (req.file) {
      const result = await imagekit.upload({
        file: req.file.buffer,
        fileName: `${Date.now()}-${req.file.originalname}`,
        folder: "/committee",
      });
      member.image = result.url;
    }

    member.name = name || member.name;
    member.role = role || member.role;
    member.city = city || member.city;
    member.linkedinUrl = linkedinUrl !== undefined ? linkedinUrl : member.linkedinUrl;

    await member.save();
    res.json(member);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteCommitteeMember = async (req, res) => {
  try {
    await Committee.findByIdAndDelete(req.params.id);
    res.json({ message: "Committee member deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

