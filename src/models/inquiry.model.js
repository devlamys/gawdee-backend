import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    number: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["B2B", "B2C"],
      required: true,
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InquiryCategory",
      required: true,
    },

    // For B2B / normal category
    note: {
      type: String,
      trim: true,
      default: "",
    },

    // Only for B2C
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      default: null,
    },

    // Only for B2C
    amount: {
      type: Number,
      default: null,
      min: 0,
    },

    status: {
      type: String,
      enum: ["new", "viewed", "contacted", "converted", "rejected"],
      default: "new",
    },
  },
  {
    timestamps: true,
  }
);

// Validation according to website form
inquirySchema.pre("validate", function (next) {
  if (this.type === "B2C") {
    if (!this.productId) {
      return next(new Error("Product is required for B2C inquiry"));
    }

    if (
      this.amount === null ||
      this.amount === undefined ||
      this.amount === ""
    ) {
      return next(new Error("Amount is required for B2C inquiry"));
    }

    this.note = "";
  }

  if (this.type === "B2B") {
    if (!this.note || !this.note.trim()) {
      return next(new Error("Note is required for B2B inquiry"));
    }

    this.productId = null;
    this.amount = null;
  }

  next();
});

const Inquiry = mongoose.model("Inquiry", inquirySchema);

export default Inquiry;
