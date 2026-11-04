import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  answerIndex: { type: Number, required: true }, // 0 to 3
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { 
  timestamps: true 
});

export const Question = mongoose.model("Question", questionSchema);
