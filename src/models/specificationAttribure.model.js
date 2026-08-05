import mongoose from "mongoose";

const specificationAttributeSchema = new mongoose.Schema(
  {
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SpecificationGroup",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    fieldType: {
      type: String,
      enum: ["text", "textarea", "select", "checkbox", "radio"],
      required: true,
    },

    defaultValue: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const SpecificationAttribute = mongoose.model(
  "SpecificationAttribute",
  specificationAttributeSchema
);

export default SpecificationAttribute;