import { Schema, model } from "mongoose";

const featureSchema = new Schema(
  {
    title: String,
    desc: String,
    image: String, // stored URL (uploaded image)
  },
  { _id: false }
);

const aboutSectionSchema = new Schema(
  {
    title: String,
    description: String,
    image: String,

    visible: {
      type: Boolean,
      default: true,
    },

    features: [featureSchema],
  },
  { timestamps: true }
);

export const AboutSection = model("AboutSection", aboutSectionSchema);