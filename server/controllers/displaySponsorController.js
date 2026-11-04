import { DisplaySponsor } from "../models/DisplaySponsor.js";
import ImageKit from "imagekit";
import dotenv from "dotenv";

dotenv.config();

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

export const getDisplaySponsors = async (req, res) => {
  try {
    const sponsors = await DisplaySponsor.find().sort({ order: 1, createdAt: -1 });
    res.json(sponsors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createDisplaySponsor = async (req, res) => {
  try {
    const { name, websiteUrl, order } = req.body;
    let logoUrl = "";

    if (req.file) {
      const result = await imagekit.upload({
        file: req.file.buffer,
        fileName: `${Date.now()}-${req.file.originalname}`,
        folder: "/sponsors",
      });
      logoUrl = result.url;
    } else if (req.body.logo) {
        logoUrl = req.body.logo;
    }

    if (!name || !logoUrl) {
      return res.status(400).json({ error: "Name and logo are required." });
    }

    const sponsor = new DisplaySponsor({ 
        name, 
        logo: logoUrl, 
        websiteUrl, 
        order: parseInt(order) || 0 
    });
    
    await sponsor.save();
    res.status(201).json(sponsor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateDisplaySponsor = async (req, res) => {
  try {
    const { name, websiteUrl, order } = req.body;
    const sponsor = await DisplaySponsor.findById(req.params.id);
    if (!sponsor) return res.status(404).json({ error: "Sponsor not found" });

    if (req.file) {
      const result = await imagekit.upload({
        file: req.file.buffer,
        fileName: `${Date.now()}-${req.file.originalname}`,
        folder: "/sponsors",
      });
      sponsor.logo = result.url;
    }

    sponsor.name = name || sponsor.name;
    sponsor.websiteUrl = websiteUrl !== undefined ? websiteUrl : sponsor.websiteUrl;
    sponsor.order = order !== undefined ? parseInt(order) : sponsor.order;

    await sponsor.save();
    res.json(sponsor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteDisplaySponsor = async (req, res) => {
  try {
    const sponsor = await DisplaySponsor.findByIdAndDelete(req.params.id);
    if (!sponsor) return res.status(404).json({ error: "Sponsor not found" });
    res.json({ message: "Sponsor deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
