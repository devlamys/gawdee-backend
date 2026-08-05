import mongoose from "mongoose";

const returnRequestSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },

  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      quantity: Number,
    },
  ],

  reason: String,

  refundMethod: {
    type: String,
    enum: ["original", "wallet", "bank"],
    default: "original",
  },

  bankDetails: {
    accountNumber: String,
    ifsc: String,
    holderName: String,
  },

  pickupDetails: {
    address: String,
    phone: String,
    date: String,
    timeSlot: String,
  },

  status: {
    type: String,
    enum: ["requested", "approved", "rejected", "picked", "refunded"],
    default: "requested",
  },

  requestId: {
    type: String,
  },

}, { timestamps: true });

const ReturnRequest =  mongoose.model("ReturnRequest", returnRequestSchema);

export default ReturnRequest;