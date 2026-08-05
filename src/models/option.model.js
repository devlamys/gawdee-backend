import mongoose from "mongoose";

const optionValueSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      default: 0,
    },

    priceType: {
      type: String,
      enum: ["fixed", "percent"],
      default: "fixed",
    },

    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  { _id: true }
);

const productOptionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["dropdown", "radio", "checkbox", "text"],
      default: "dropdown",
    },

    isRequired: {
      type: Boolean,
      default: false,
    },

    pricePerProduct: {
      type: Boolean,
      default: false,
    },

    values: [optionValueSchema],

    language: {
      type: String,
      default: "en",
    },
  },
  {
    timestamps: true,
  }
);

const Option =  mongoose.model("Option", productOptionSchema);

export default Option;
