import { Schema, model } from "mongoose";

const faqSchema = new Schema(
  {
    question: String,
    answer: String,
  },
  { _id: false }
);

const faqSectionSchema = new Schema(
  {
    title1: String,
    title2: String,
    description: String,

    tags: [String],

    visible: {
      type: Boolean,
      default: true,
    },

    faqs: [faqSchema],
  },
  { timestamps: true }
);

export const FAQSection = model("FAQSection", faqSectionSchema);