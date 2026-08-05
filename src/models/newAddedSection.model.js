import { Schema, model } from "mongoose";

const newProductSectionSchema = new Schema(
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

export const NewProductSection = model(
  "NewProductSection",
  newProductSectionSchema
);