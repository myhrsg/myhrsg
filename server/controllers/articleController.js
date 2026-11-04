import mongoose from "mongoose";
import Article from "../models/Article.js";

// Create
export const createArticle = async (req, res) => {
  try {
    if (req.body.slug) {
      const existing = await Article.findOne({ slug: req.body.slug });
      if (existing) {
        return res.status(400).json({ message: "URL slug is already in use by another article." });
      }
    }
    const article = new Article(req.body);
    await article.save();
    res.status(201).json(article);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Read All
export const getArticles = async (req, res) => {
  try {
    const { all } = req.query;
    const filter = {};
    if (all !== "true") {
      filter.status = "published";
    }
    const articles = await Article.find(filter).sort({ date: -1, createdAt: -1 });
    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Read By ID
export const getArticleById = async (req, res) => {
  try {
    const { id } = req.params;
    let article;
    if (mongoose.Types.ObjectId.isValid(id)) {
      article = await Article.findById(id);
    } else {
      article = await Article.findOne({ slug: id });
    }
    if (!article) return res.status(404).json({ message: "Article not found" });
    res.status(200).json(article);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update
export const updateArticle = async (req, res) => {
  try {
    if (req.body.slug) {
      const existing = await Article.findOne({ slug: req.body.slug, _id: { $ne: req.params.id } });
      if (existing) {
        return res.status(400).json({ message: "URL slug is already in use by another article." });
      }
    }
    const article = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!article) return res.status(404).json({ message: "Article not found" });
    res.status(200).json(article);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete
export const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) return res.status(404).json({ message: "Article not found" });
    res.status(200).json({ message: "Article deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
