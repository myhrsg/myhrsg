import { WhatsAppCommunity } from "../models/WhatsAppCommunity.js";
import ImageKit from "imagekit";
import dotenv from "dotenv";

dotenv.config();

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

export const getWhatsAppCommunities = async (req, res) => {
  try {
    const communities = await WhatsAppCommunity.find().sort({ order: 1, createdAt: 1 });
    res.json(communities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createWhatsAppCommunity = async (req, res) => {
  try {
    const { city, whatsappLink, order } = req.body;
    let imageUrl = "";
    if (req.file) {
      const result = await imagekit.upload({
        file: req.file.buffer,
        fileName: `${Date.now()}-${req.file.originalname}`,
        folder: "/whatsapp-communities",
      });
      imageUrl = result.url;
    }

    let maxOrder = 0;
    const lastCommunity = await WhatsAppCommunity.findOne().sort({ order: -1 });
    if (lastCommunity) {
      maxOrder = lastCommunity.order;
    }

    const newCommunity = new WhatsAppCommunity({
      city,
      whatsappLink,
      qrImage: imageUrl,
      order: order !== undefined ? parseInt(order) : (maxOrder + 1)
    });
    await newCommunity.save();
    res.status(201).json(newCommunity);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateWhatsAppCommunity = async (req, res) => {
  try {
    const { city, whatsappLink, order } = req.body;
    const community = await WhatsAppCommunity.findById(req.params.id);
    if (!community) return res.status(404).json({ error: "WhatsApp community not found" });
    if (req.file) {
      const result = await imagekit.upload({
        file: req.file.buffer,
        fileName: `${Date.now()}-${req.file.originalname}`,
        folder: "/whatsapp-communities",
      });
      community.qrImage = result.url;
    }
    community.city = city || community.city;
    community.whatsappLink = whatsappLink || community.whatsappLink;
    if (order !== undefined) {
      community.order = parseInt(order);
    }
    await community.save();
    res.json(community);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteWhatsAppCommunity = async (req, res) => {
  try {
    await WhatsAppCommunity.findByIdAndDelete(req.params.id);
    res.json({ message: "WhatsApp community deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const reorderWhatsAppCommunities = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids)) {
      return res.status(400).json({ error: "ids must be an array" });
    }
    const bulkOps = ids.map((id, index) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { order: index } }
      }
    }));
    await WhatsAppCommunity.bulkWrite(bulkOps);
    res.json({ message: "WhatsApp communities reordered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
