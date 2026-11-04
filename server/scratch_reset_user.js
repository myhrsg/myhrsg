import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

const MONGODB_URI = process.env.MONGODB_URI;

const userSchema = new mongoose.Schema({
  email: String,
  linkedin: String,
  dob: Date,
  position: String,
  company: String,
  profileComplete: Boolean,
});

const User = mongoose.model("User", userSchema);

async function resetUser() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    const email = "piyushaamrutkar007@gmail.com";
    const user = await User.findOne({ email });

    if (!user) {
      console.log(`User with email ${email} not found.`);
      process.exit(0);
    }

    console.log(`Found user: ${user.email}. Current status: ${user.profileComplete ? "Complete" : "Incomplete"}`);

    // Reset details to trigger the completeness check
    user.linkedin = undefined;
    user.dob = undefined;
    user.position = undefined;
    user.profileComplete = true; // Keep it true in DB, but the check should now fail

    await user.save();

    console.log(`Successfully reset details for ${email}. Please log in or refresh your dashboard to test.`);
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

resetUser();
