 import { Schema, model } from "mongoose";

const mostLovedSchema = new Schema(
  {
    title: String,
    description: String,
    visible: {
      type: Boolean,
      default: true,
    },

    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product", 
      },
    ],
  },
  { timestamps: true }
);

export const MostLoved = model("MostLoved", mostLovedSchema);