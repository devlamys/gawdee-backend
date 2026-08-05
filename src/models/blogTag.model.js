import mongoose from "mongoose";

const blogTagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    content: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["published", "draft"],
      default: "published",
    },

    metaTitle: {
      type: String,
      default: "",
    },

    metaDescription: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const BlogTag =  mongoose.model("BlogTag", blogTagSchema);

export default BlogTag;