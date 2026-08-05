import { Schema, model } from "mongoose";

const videoItemSchema = new Schema({
  video: String,   // hPanel URL
  cover: String,   // thumbnail image URL

  productId: {
    type: Schema.Types.ObjectId,
    ref: "Product",
  },

  link: String,
  heading: String,
  description: String,
});

const videoSectionSchema = new Schema(
  {
    title: String,

    visible: {
      type: Boolean,
      default: true,
    },

    videos: [videoItemSchema],
  },
  { timestamps: true }
);

export const VideoSection = model("VideoSection", videoSectionSchema);