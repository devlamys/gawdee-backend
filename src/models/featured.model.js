import { Schema, model } from "mongoose";

const featuredSchema = new Schema(
  {
    title: String,
    description: String,

    visible: {
      type: Boolean,
      default: true,
    },

    // 🔥 You can choose one of these options:

    // OPTION 1: Products (like Most Loved)
    products: [
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
    tag: String,
    label: String,
  }
],

    // OPTION 2 (Optional): Custom cards (if needed later)
    cards: [
      {
        title: String,
        description: String,
        image: String,
      },
    ],
  },
  { timestamps: true }
);

export const Featured = model("Featured", featuredSchema);