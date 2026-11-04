import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema({
  type: { type: String, enum: ["member", "sponsor"], required: true },
  name: { type: String, required: true },
  designation: { type: String },
  link: { type: String, required: true },
  thumbnail: { type: String },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export const Testimonial = mongoose.models.Testimonial || mongoose.model("Testimonial", testimonialSchema);
