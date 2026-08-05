import mongoose from "mongoose";

const flashSaleProductSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  quantity: {
    type: Number,
    required: true,
  },
});

const flashSaleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["published", "draft"],
      default: "draft",
    },

    endDate: {
      type: Date,
      required: true,
    },

    products: [flashSaleProductSchema],
  },
  {
    timestamps: true,
  }
);

const FlashSale =  mongoose.model("FlashSale", flashSaleSchema);

export default FlashSale;