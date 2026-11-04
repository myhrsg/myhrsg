import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema({
  caption: { type: String, required: true },
  image: { type: String, required: true }
}, { 
  timestamps: true 
});

export const Gallery = mongoose.models.Gallery || mongoose.model("Gallery", gallerySchema);
