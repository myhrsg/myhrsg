import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  chapterId: { type: mongoose.Schema.Types.ObjectId, ref: "Chapter", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  userName: { type: String, required: true },
  text: { type: String, required: true },
}, { 
  timestamps: { createdAt: true, updatedAt: false } 
});

export const Comment = mongoose.model("Comment", commentSchema);
