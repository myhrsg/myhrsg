import mongoose from "mongoose";

const chapterSchema = new mongoose.Schema({
  title: { type: String, required: true },
  mentorName: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: Date, required: true },
  type: { type: String, enum: ["past", "upcoming"], required: true },
  images: [{ type: String }], // ImageKit URLs (max 10)
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { 
  timestamps: true 
});

export const Chapter = mongoose.model("Chapter", chapterSchema);
