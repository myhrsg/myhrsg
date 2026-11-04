import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  // Improve deliverability
  pool: true,
  maxConnections: 3,
  maxMessages: 10,
});

// Standardized "from" with display name — critical for avoiding spam
export const EMAIL_FROM = `"myHRSG" <${process.env.EMAIL_USER}>`;
