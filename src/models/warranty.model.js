import mongoose from "mongoose";

const { Schema, model } = mongoose;

const warrantySchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    productColor: { type: String, required: true },
    warrantyNumber: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default model("Warranty", warrantySchema);
