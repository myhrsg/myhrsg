import mongoose from "mongoose";

const committeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  city: { type: String, required: true },
  linkedinUrl: { type: String },
  image: { type: String }, // ImageKit URL
  createdAt: { type: Date, default: Date.now }
});

export const Committee = mongoose.model("Committee", committeeSchema);
