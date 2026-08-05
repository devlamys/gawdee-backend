import mongoose from "mongoose";

const orderSummarySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    orderId: {
      type: String,
      unique: true,
      trim: true,
    },

    customerDetails: {
      firstName: { type: String, required: true },
      lastName: { type: String },
      companyName: { type: String },
      country: { type: String },
      streetAddress: { type: String },
      state: { type: String },
      pinCode: { type: String },
      phone: { type: String, required: true },
      email: { type: String },
    },

    orderItems: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },

        name: {
          type: String,
          default: "",
        },

        quantity: {
          type: Number,
          required: true,
          min: 1,
        },

        // ✅ Sale price including tax
        // Example: 759
        price: {
          type: Number,
          required: true,
          min: 0,
        },

        salePrice: {
          type: Number,
          default: 0,
        },

        sellingPrice: {
          type: Number,
          default: 0,
        },

        // ✅ MRP / original price
        // Example: 799
        mrp: {
          type: Number,
          default: 0,
        },

        originalPrice: {
          type: Number,
          default: 0,
        },

        // ✅ Base amount without tax
        // Example: 723
        basePrice: {
          type: Number,
          default: 0,
        },

        taxablePrice: {
          type: Number,
          default: 0,
        },

        selectedColor: {
          type: String,
          default: "",
        },

        variant: {
          type: String,
          default: "",
        },

        selectedColorImage: {
          type: String,
          default: "",
        },

        image: {
          type: String,
          default: "",
        },

        discountAmount: {
          type: Number,
          default: 0,
        },

        discountPercent: {
          type: Number,
          default: 0,
        },

        discountTotal: {
          type: Number,
          default: 0,
        },

        tax: {
          type: Number,
          default: 0,
        },

        gst: {
          type: Number,
          default: 0,
        },

        taxRate: {
          type: Number,
          default: 5,
        },

        taxIncluded: {
          type: Boolean,
          default: true,
        },

        mrpTotal: {
          type: Number,
          default: 0,
        },

        taxableTotal: {
          type: Number,
          default: 0,
        },

        saleTotal: {
          type: Number,
          default: 0,
        },

        total: {
          type: Number,
          default: 0,
        },
      },
    ],

    priceDetails: {
      // ✅ MRP subtotal
      // Example: 799
      subtotal: {
        type: Number,
        required: true,
      },

      // ✅ Base amount without tax
      // Example: 723
      taxableSubtotal: {
        type: Number,
        default: 0,
      },

      // ✅ Sale total including tax
      // Example: 759
      saleSubtotal: {
        type: Number,
        default: 0,
      },

      // ✅ MRP - sale price
      // Example: 40
      discount: {
        type: Number,
        default: 0,
      },

      couponDiscount: {
        type: Number,
        default: 0,
      },

      shippingCost: {
        type: Number,
        default: 0,
      },

      giftPackaging: {
        type: Number,
        default: 0,
      },

      // ✅ Included tax
      // Example: 36
      tax: {
        type: Number,
        default: 0,
      },

      gst: {
        type: Number,
        default: 0,
      },

      taxRate: {
        type: Number,
        default: 5,
      },

      taxIncluded: {
        type: Boolean,
        default: true,
      },

      finalAmount: {
        type: Number,
        required: true,
      },

      totalSavings: {
        type: Number,
        default: 0,
      },
    },

    totalPrice: {
      type: Number,
      default: 0,
    },

    gst: {
      type: Number,
      default: 0,
    },

    tax: {
      type: Number,
      default: 0,
    },

    finalAmount: {
      type: Number,
      default: 0,
    },

    deliveryDetails: {
      methodId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DeliveryOption",
        default: null,
      },

      name: {
        type: String,
        default: "",
        trim: true,
      },

      price: {
        type: Number,
        default: 0,
      },

      estimatedDays: {
        type: String,
        default: "",
        trim: true,
      },
    },

    orderStatus: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Processing",
        "Packed",
        "Shipped",
        "Out For Delivery",
        "Delivered",
        "Cancelled",
      ],
      default: "Pending",
    },

    orderStatusHistory: [
      {
        status: {
          type: String,
          enum: [
            "Pending",
            "Confirmed",
            "Processing",
            "Packed",
            "Shipped",
            "Out For Delivery",
            "Delivered",
            "Cancelled",
          ],
        },
        message: {
          type: String,
          default: "",
        },
        changedAt: {
          type: Date,
          default: Date.now,
        },
        changedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          default: null,
        },
      },
    ],

    whatsappNotifications: {
      orderReceived: {
        sent: { type: Boolean, default: false },
        sentAt: { type: Date, default: null },
        response: { type: mongoose.Schema.Types.Mixed, default: null },
      },

      confirmed: {
        sent: { type: Boolean, default: false },
        sentAt: { type: Date, default: null },
        response: { type: mongoose.Schema.Types.Mixed, default: null },
      },

      packed: {
        sent: { type: Boolean, default: false },
        sentAt: { type: Date, default: null },
        response: { type: mongoose.Schema.Types.Mixed, default: null },
      },

      shipped: {
        sent: { type: Boolean, default: false },
        sentAt: { type: Date, default: null },
        response: { type: mongoose.Schema.Types.Mixed, default: null },
      },

      outForDelivery: {
        sent: { type: Boolean, default: false },
        sentAt: { type: Date, default: null },
        response: { type: mongoose.Schema.Types.Mixed, default: null },
      },

      delivered: {
        sent: { type: Boolean, default: false },
        sentAt: { type: Date, default: null },
        response: { type: mongoose.Schema.Types.Mixed, default: null },
      },

      invoice: {
        sent: { type: Boolean, default: false },
        sentAt: { type: Date, default: null },
        response: { type: mongoose.Schema.Types.Mixed, default: null },
      },

      cancelled: {
        sent: { type: Boolean, default: false },
        sentAt: { type: Date, default: null },
        response: { type: mongoose.Schema.Types.Mixed, default: null },
      },
    },

    cancelledAt: {
      type: Date,
      default: null,
    },

    cancelReason: {
      type: String,
      default: "",
    },

    // Manual / old courier fields
    courierName: {
      type: String,
      default: "",
    },

    courierNumber: {
      type: String,
      default: "",
    },

    // iCarry shipping fields
    shippingProvider: {
      type: String,
      enum: ["", "icarry"],
      default: "",
    },

    shipmentId: {
      type: String,
      default: "",
    },

    awbNumber: {
      type: String,
      default: "",
    },

    labelUrl: {
      type: String,
      default: "",
    },

    // IMPORTANT:
    // Store only iCarry tracking URL here.
    // Do not store shop.gawdee.com order detail URL here.
    trackingUrl: {
      type: String,
      default: "",
    },

    shippingStatus: {
      type: String,
      default: "Pending",
    },

    shippingResponse: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    // WhatsApp shipping message control
    // This prevents duplicate shipping WhatsApp messages.
    shippingWhatsappSent: {
      type: Boolean,
      default: false,
    },

    shippingWhatsappSentAt: {
      type: Date,
      default: null,
    },

    pickedUpAt: {
      type: Date,
      default: null,
    },

    deliveredAt: {
      type: Date,
      default: null,
    },

    paymentMethod: {
      type: String,
      enum: ["credit_card", "COD", "razorpay"],
      default: "razorpay",
    },

    paymentStatus: {
      type: String,
      enum: ["unpaid", "completed", "cancelled"],
      default: "completed",
    },

    appliedCoupon: {
      type: String,
      default: "",
    },

    currency: {
      type: String,
      default: "INR",
    },

    returnRequestStatus: {
      type: String,
      enum: ["none", "requested", "approved", "rejected"],
      default: "none",
    },

    orderNumber: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

orderSummarySchema.pre("save", async function (next) {
  try {
    if (!this.orderNumber) {
      let isUnique = false;
      let orderNumber;

      while (!isUnique) {
        const randomNumber = Math.floor(100000 + Math.random() * 900000);
        orderNumber = `GAW-${randomNumber}`;

        const existing = await mongoose.models.OrderSummary.findOne({
          orderNumber,
        });

        if (!existing) {
          isUnique = true;
        }
      }

      this.orderNumber = orderNumber;
    }

    if (this.orderItems && this.orderItems.length > 0) {
      this.orderItems = this.orderItems.map((item) => {
        const qty = Number(item.quantity || 1);

        // ✅ price is selling price including tax
        const salePrice = Number(item.price || item.salePrice || 0);
        const mrp = Number(item.mrp || item.originalPrice || salePrice || 0);
        const basePrice = Number(item.basePrice || item.taxablePrice || 0);

        item.salePrice = Number(item.salePrice || salePrice);
        item.sellingPrice = Number(item.sellingPrice || salePrice);

        item.originalPrice = Number(item.originalPrice || mrp);

        item.basePrice = basePrice;
        item.taxablePrice = Number(item.taxablePrice || basePrice);

        item.gst = Number(item.gst || item.tax || 0);
        item.taxIncluded = item.taxIncluded !== false;

        item.mrpTotal = Number(item.mrpTotal || mrp * qty);
        item.taxableTotal = Number(item.taxableTotal || basePrice * qty);
        item.saleTotal = Number(item.saleTotal || salePrice * qty);

        // ✅ total should be sale price including tax
        item.total = Number(item.total || salePrice * qty);

        return item;
      });
    }

    if (this.deliveryDetails) {
      this.priceDetails.shippingCost = Number(
        this.deliveryDetails.price || this.priceDetails.shippingCost || 0
      );
    }

    this.priceDetails.gst = Number(
      this.priceDetails.gst || this.priceDetails.tax || 0
    );

    this.priceDetails.taxIncluded = this.priceDetails.taxIncluded !== false;

    // ✅ Do not add tax again because sale price already includes tax.
    // subtotal is MRP, discount is MRP - sale price.
    const subtotal = Number(this.priceDetails.subtotal || 0);
    const discount = Number(this.priceDetails.discount || 0);
    const couponDiscount = Number(this.priceDetails.couponDiscount || 0);
    const shippingCost = Number(this.priceDetails.shippingCost || 0);
    const giftPackaging = Number(this.priceDetails.giftPackaging || 0);

    this.priceDetails.finalAmount = Number(
      this.priceDetails.finalAmount ||
        subtotal - discount - couponDiscount + shippingCost + giftPackaging
    );

    this.totalPrice = Number(
      this.totalPrice ||
        this.priceDetails.saleSubtotal ||
        this.priceDetails.finalAmount ||
        0
    );

    this.finalAmount = Number(
      this.finalAmount ||
        this.priceDetails.finalAmount ||
        this.priceDetails.saleSubtotal ||
        0
    );

    this.gst = Number(this.gst || this.priceDetails.tax || 0);
    this.tax = Number(this.tax || this.priceDetails.tax || 0);

    next();
  } catch (error) {
    next(error);
  }
});

const OrderSummary = mongoose.model("OrderSummary", orderSummarySchema);

export default OrderSummary;
