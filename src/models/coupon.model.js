import { Schema, model } from "mongoose";

const CouponSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    couponCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      unique: true,
    },

    amountType: {
      type: String,
      enum: ["flat", "percentage"],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      default: null,
    },

    image: {
      type: String,
      default: "",
    },

    // ✅ Frontend apply type
    applyType: {
      type: String,
      enum: ["all_website", "product_wise"],
      default: "all_website",
      required: true,
    },

    // ✅ Product-wise coupon products
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    // ✅ Optional: category-wise support for future
    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },
    showOnWebsite: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

CouponSchema.pre("validate", function (next) {
  if (this.amountType === "percentage" && this.amount > 100) {
    return next(new Error("Percentage discount cannot be more than 100"));
  }

  if (this.applyType === "all_website") {
    this.products = [];
  }

  if (
    this.applyType === "product_wise" &&
    (!this.products || this.products.length === 0)
  ) {
    return next(
      new Error("Please select at least one product for product-wise coupon")
    );
  }

  next();
});

const Coupon = model("Coupon", CouponSchema);

export default Coupon;
