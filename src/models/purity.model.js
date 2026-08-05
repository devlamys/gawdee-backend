import { Schema, model } from "mongoose";

const cardSchema = new Schema(
  {
    title: String,
    desc: String,
    image: String, // uploaded image URL
  },
  { _id: false }
);

const puritySectionSchema = new Schema(
  {
    title: String,

    visible: {
      type: Boolean,
      default: true,
    },

    cards: [cardSchema],
  },
  { timestamps: true }
);

export const PuritySection = model("PuritySection", puritySectionSchema);