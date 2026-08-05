import mongoose from "mongoose";

const taxSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    percentage: {
      type: Number,
      // required: true,
    },

    priority: {
      type: Number,
      // required: true,
      default: 1,
    },

    status: {
      type: String,
      enum: ["published", "draft"],
      default: "published",
    },
  },
  {
    timestamps: true,
  }
);

const Tax =  mongoose.model("Tax", taxSchema);

export default Tax;