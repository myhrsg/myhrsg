import mongoose from "mongoose";

const displaySponsorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  logo: { type: String, required: true }, // ImageKit URL
  websiteUrl: { type: String },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export const DisplaySponsor = mongoose.model("DisplaySponsor", displaySponsorSchema);
