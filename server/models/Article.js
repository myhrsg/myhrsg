import mongoose from "mongoose";

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true, sparse: true },
  description: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, required: true },
  date: { type: Date, required: true },
  image: { type: String },
  author: { type: String, default: "Admin" },
  metaTitle: { type: String },
  metaDescription: { type: String },
  status: { type: String, enum: ["draft", "published"], default: "draft" },
}, { timestamps: true });

articleSchema.pre("save", function() {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
});

export default mongoose.model("Article", articleSchema);
