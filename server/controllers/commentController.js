import { Comment } from "../models/Comment.js";

export const getCommentsByChapter = async (req, res) => {
  try {
    const comments = await Comment.find({ chapterId: req.params.chapterId }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createComment = async (req, res) => {
  try {
    const { chapterId, text } = req.body;
    
    const newComment = new Comment({
      chapterId,
      userId: req.user?._id,
      userName: req.user?.name || "Anonymous",
      text,
    });

    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
