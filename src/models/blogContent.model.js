import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema({
  // type: {
  //   type: String,
  //   required: true,
  //   enum: ["text", "list"] // Supports "text" for paragraphs/headings and "list" for bullet points
  // },
  // content: {
  //   type: String, // For "text" content
  //   required: function () {
  //     return this.type === "text";
  //   }
  // },
  // items: {
  //   type: [String], // For "list" content
  //   required: function () {
  //     return this.type === "list";
  //   }
  // }
  text: { type: String},
});

const blogSchema = new mongoose.Schema(
  {
    blogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RotexBlog",
      required: true,
    },
    // author: {
    //   type: String,
    //   // required: true
    // },
    // date: {
    //   type: Date,
    //   default: Date.now
    // },
    image: {
      type: String, 
    },
    sections: {
      type: [sectionSchema],
      validate: [arrayLimit, "A blog must have at least one section."]
    }
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Custom validation for sections array
function arrayLimit(val) {
  return val.length > 0; // At least one section is required
}

const BlogDetails = mongoose.model("BlogDetails", blogSchema);

export default BlogDetails;
