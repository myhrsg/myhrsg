import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import dotenv from "dotenv";
import passport from "./config/passport.js";
import { connectDB } from "./config/db.js";
import apiRoutes from "./routes/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Database Serverless Middleware
// This guarantees that any incoming Vercel Serverless request ensures MongoDB is fully loaded from the cache!
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173", 
  credentials: true
}));
app.use(express.json());
app.use(passport.initialize());

// Request Logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// API Routes
app.use("/api", apiRoutes);

// Root Endpoint for Vercel Verification
app.get("/", (req, res) => {
  res.status(200).json({ message: "myHRSG Backend API is running successfully!" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);
  res.status(500).json({ error: "Internal Server Error", message: err.message, stack: process.env.NODE_ENV === 'development' ? err.stack : undefined });
});

// Start Server
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;
