import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    slug: { type: String, default: "" },

    smallImage: { type: String, default: "" },
    bigImage: { type: String, default: "" },

    content: { type: String, default: "" },

    description: { type: String, default: "" },

    isFeatured: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["published", "draft"],
      default: "published",
    },

    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
  },
  { _id: true }
);

const blogSectionSchema = new mongoose.Schema(
  {
    sectionTitle: { type: String, default: "" },
    sectionDesc: { type: String, default: "" },
    visible: { type: Boolean, default: true },

    blogs: {
      type: [blogSchema],
      default: [],
    },
  },
  { timestamps: true }
);

const BlogSection = mongoose.model("BlogSection", blogSectionSchema);

export default BlogSection;