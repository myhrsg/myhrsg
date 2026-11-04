import mongoose from "mongoose";

const mentorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String, required: true },
  linkedinUrl: { type: String },
  photo: { type: String }, // ImageKit URL
  createdAt: { type: Date, default: Date.now }
});

export const Mentor = mongoose.model("Mentor", mentorSchema);
