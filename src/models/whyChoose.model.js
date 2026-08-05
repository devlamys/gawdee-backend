import { Schema, model } from "mongoose";

const pointSchema = new Schema(
  {
    title: String,
    desc: String,
    image: String, // uploaded icon URL
  },
  { _id: false }
);

const whyChooseSchema = new Schema(
  {
    title: String,
    desc: String,

    visible: {
      type: Boolean,
      default: true,
    },

    points: [pointSchema],
  },
  { timestamps: true }
);

export const WhyChoose = model("WhyChoose", whyChooseSchema);