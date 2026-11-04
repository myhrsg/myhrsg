import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  linkedinId: { type: String, unique: true, sparse: true },
  googleId: { type: String, unique: true, sparse: true },
  company: String,
  linkedin: String,
  city: String,
  pincode: String,
  position: String,
  dob: { type: Date },
  profileImage: String,
  role: { type: String, enum: ["member", "admin"], default: "member" },
  isMainAdmin: { type: Boolean, default: false },
  profileComplete: { type: Boolean, default: false },
  status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
  isEmailVerified: { type: Boolean, default: false },
  otp: String,
  otpExpires: Date,
  createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.models.User || mongoose.model("User", userSchema);
