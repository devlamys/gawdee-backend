import mongoose, { Schema, model } from "mongoose";

const amazonOrderSchema = new Schema(
  {
    amazonOrderId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    marketplaceId: String,
    orderStatus: String,
    fulfillmentChannel: String,
    salesChannel: String,
    purchaseDate: Date,
    lastUpdateDate: Date,
    buyerEmail: String,
    buyerName: String,
    shippingAddress: {
      name: String,
      addressLine1: String,
      addressLine2: String,
      city: String,
      stateOrRegion: String,
      postalCode: String,
      countryCode: String,
      phone: String,
    },
    amount: {
      type: Number,
      default: 0,
    },
    currency: String,
    items: [
      {
        asin: String,
        sellerSku: String,
        orderItemId: String,
        title: String,
        quantityOrdered: Number,
        quantityShipped: Number,
        itemPrice: Number,
        currency: String,
      },
    ],
    rawData: {
      type: Schema.Types.Mixed,
      default: {},
    },
    syncStatus: {
      type: String,
      enum: ["synced", "failed"],
      default: "synced",
    },
    syncError: String,
  },
  { timestamps: true }
);

const AmazonOrder = model("AmazonOrder", amazonOrderSchema);
export default AmazonOrder;
