import mongoose from "mongoose";

const specificationTableGroupSchema = new mongoose.Schema(
  {
    groupName: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    specificationGroups: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SpecificationGroup",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const SpecificationTable = mongoose.model(
  "SpecificationTable",
  specificationTableGroupSchema
);

export default SpecificationTable;