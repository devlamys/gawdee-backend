import { Schema, model } from "mongoose";

const heroBannerSchema = new Schema(
  {
    mainBanner: {
      type: String,
      required: true,
      trim: true,
    },

    mobileBanner: {
      type: String,
      required: true,
      trim: true,
    },

    url: {
      type: String,
      default: "",
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const HeroBanner = model("HeroBanner", heroBannerSchema);

export default HeroBanner;