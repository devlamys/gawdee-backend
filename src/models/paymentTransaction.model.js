import mongoose from "mongoose";

const paymentTransactionSchema = new mongoose.Schema(
  {
    chargeId: {
      type: String,
      required: true,
      unique: true,
    },

    payerName: {
      type: String,
      required: true,
      trim: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      default: "USD",
    },

    paymentChannel: {
      type: String,
      enum: [
        "paypal",
        "cod",
        "bank_transfer",
        "paystack",
        "mollie",
      ],
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },

    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const PaymentTransaction = mongoose.model(
  "PaymentTransaction",
  paymentTransactionSchema
);

export default PaymentTransaction;