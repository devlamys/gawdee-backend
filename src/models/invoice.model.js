// models/invoice.model.js
import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrderSummary",
      required: true,
      unique: true,
    },
    invoiceUrl: {
      type: String,
      default: "",
    },
    invoiceNumber: {
      type: String,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    billingDetails: {
      name: String,
      email: String,
      phone: String,
      address: String,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },

        name: String,
        quantity: Number,

        // MRP / original price
        mrp: Number,
        originalPrice: Number,

        // Rate / sale price
        price: Number,
        rate: Number,
        salePrice: Number,
        sellingPrice: Number,

        selectedColor: String,
        variant: String,
        selectedColorImage: String,
        image: String,

        discountAmount: Number,

        tax: Number,
        gst: Number,
        taxRate: Number,

        // Total without tax
        total: Number,

        // Total with tax
        itemTotal: Number,
      },
    ],
    priceDetails: {
      subtotal: Number,
      originalSubtotal: Number,
      discount: Number,
      couponDiscount: Number,
      shippingCost: Number,
      tax: Number,
      gst: Number,
      taxRate: Number,
      finalAmount: Number,
    },
    paymentMethod: String,
    paymentStatus: String,
    currency: { type: String, default: "INR" },
  },

  { timestamps: true }
);

// 🔥 Invoice Number Generator
invoiceSchema.pre("save", async function (next) {
  if (!this.invoiceNumber) {
    const random = Math.floor(100000 + Math.random() * 900000);
    this.invoiceNumber = `INV-${random}`;
  }
  next();
});

const Invoice = mongoose.model("Invoice", invoiceSchema);
export default Invoice;
