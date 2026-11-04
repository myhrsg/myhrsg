import mongoose from "mongoose";

const sponsorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  company: String,
  designation: String,
  city: String,
  background: String,
  createdAt: { type: Date, default: Date.now }
});

export const Sponsor = mongoose.model("Sponsor", sponsorSchema);
