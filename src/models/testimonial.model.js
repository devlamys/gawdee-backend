import { Schema, model } from "mongoose";

const testimonialSchema = new Schema(
  {
    name: String,
    location: String,
    rating: Number,
    product: String,
    short: String,
    full: String,
    tags: [String],
    image: String, // uploaded image URL
  },
  { _id: false }
);

const testimonialSectionSchema = new Schema(
  {
    title1: String,
    title2: String,
    desc: String,

    visible: {
      type: Boolean,
      default: true,
    },

    testimonials: [testimonialSchema],
  },
  { timestamps: true }
);

export const TestimonialSection = model(
  "TestimonialSection",
  testimonialSectionSchema
);