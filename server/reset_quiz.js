import mongoose from "mongoose";
import dotenv from "dotenv";
import { Question } from "./models/Question.js";

dotenv.config({ path: "./.env" });

const updateSeed = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");
        
        // Count questions
        const count = await Question.countDocuments();
        console.log(`Found ${count} questions.`);
        
        // Remove existing questions to trigger fresh seed in server or just do it here
        await Question.deleteMany({});
        console.log("Cleared existing questions.");
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

updateSeed();
