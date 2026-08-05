import mongoose from "mongoose";

const specificationGroupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const SpecificationGroup = mongoose.model(
  "SpecificationGroup",
  specificationGroupSchema
);

export default SpecificationGroup;