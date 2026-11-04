import mongoose from "mongoose";

const whatsAppCommunitySchema = new mongoose.Schema({
  city: { type: String, required: true },
  whatsappLink: { type: String, required: true },
  qrImage: { type: String }, // ImageKit URL
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export const WhatsAppCommunity = mongoose.model("WhatsAppCommunity", whatsAppCommunitySchema);
