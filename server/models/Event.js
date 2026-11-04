import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  mentorName: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: Date, required: true },
  type: { type: String, enum: ["past", "upcoming"], required: true },
  images: [{ type: String }], // ImageKit URLs (max 10)
  registrationUrl: { type: String }, // Added for Luma integration
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { 
  timestamps: true 
});

export const Event = mongoose.models.Event || mongoose.model("Event", eventSchema);
