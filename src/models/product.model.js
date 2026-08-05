import mongoose from "mongoose";
import paginate from "./plugins/paginate.plugin.js";

const { Schema, model } = mongoose;

const productSchema = new Schema(
  {
    // ======================
    // EXISTING FIELDS
    // ======================
    name: { type: String, required: true, trim: true },

    slug: { type: String, unique: true, lowercase: true, trim: true },

    subTitle: { type: String, trim: true },

    description: { type: String, trim: true },

    content: { type: String },

    categoryId: { type: Schema.Types.ObjectId, ref: "Category" },

    brandId: { type: Schema.Types.ObjectId, ref: "Brand" },

    collectionIds: [{ type: Schema.Types.ObjectId, ref: "Collection" }],

    labelIds: [{ type: Schema.Types.ObjectId, ref: "Label" }],

    taxId: { type: Schema.Types.ObjectId, ref: "Tax" },

    images: [
      {
        type: Schema.Types.Mixed,
      },
    ],

    sku: String,

    price: { type: Number, default: 0 },

    salePrice: { type: Number, default: 0 },

    discountStart: Date,
    discountEnd: Date,

    priceIncludesTax: { type: Boolean, default: false },

    costPerItem: { type: Number, default: 0 },

    featuredImage: { type: String, default: "" },

    barcode: String,

    stockStatus: {
      type: String,
      enum: ["in_stock", "out_of_stock", "on_backorder"],
      default: "in_stock",
    },

    withStorehouseManagement: { type: Boolean, default: false },

    // ======================
    // INVENTORY MANAGEMENT
    // ======================
    inventory: {
      stock: {
        type: Number,
        default: 0,
      },

      status: {
        type: String,
        enum: ["In Stock", "Low Stock", "Out of Stock"],
        default: "Out of Stock",
      },

      warehouse: {
        type: String,
        enum: ["Main Warehouse", "Secondary Warehouse", "Cold Storage"],
        default: "Main Warehouse",
      },

      lowStockThreshold: {
        type: Number,
        default: 5,
      },

      isVisible: {
        type: Boolean,
        default: true,
      },
    },

    weight: Number,

    weightUnit: {
      type: String,
      enum: ["g", "kg", "ltr", "oz"],
      default: "g",
    },

    dimensions: {
      length: Number,
      width: Number,
      height: Number,
      unit: {
        type: String,
        enum: ["cm", "in", "m"],
        default: "cm",
      },
    },

    attributes: [
      {
        variantId: String,

        name: {
          type: String,
          required: true,
        },

        price: {
          type: Number,
          required: true,
        },

        salePrice: {
          type: Number,
          default: 0,
        },

        weight: String,

        images: [
          {
            type: Schema.Types.Mixed,
          },
        ],

        isDefault: {
          type: Boolean,
          default: false,
        },
      },
    ],

    // ======================
    // AMAZON SP-API INTEGRATION
    // ======================
    amazonIntegration: {
      sellerSku: { type: String, default: "" },
      asin: { type: String, default: "" },
      productType: { type: String, default: "PRODUCT" },
      marketplaceId: { type: String, default: "" },
      listingStatus: {
        type: String,
        enum: [
          "not_synced",
          "ready",
          "pending",
          "synced",
          "inventory_updated",
          "price_updated",
          "failed",
        ],
        default: "not_synced",
      },
      quantity: { type: Number, default: 0 },
      price: { type: Number, default: 0 },
      syncEnabled: { type: Boolean, default: false },
      syncError: { type: String, default: "" },
      lastSyncedAt: Date,
    },

    // ======================
    // FEATURES SECTION
    // ======================
    features: [
      {
        id: String,
        title: String,
        description: String,
        icon: {
          type: Schema.Types.Mixed,
          default: "",
        },
      },
    ],

    // ======================
    // WHY SECTION
    // ======================
    whySection: {
      title: String,
      subtitle: String,
      image: {
        type: Schema.Types.Mixed,
        default: "",
      },

      points: [
        {
          icon: {
            type: Schema.Types.Mixed,
            default: "",
          },
          title: String,
          description: String,
        },
      ],
    },

    // ======================
    // PRODUCT INFO SECTION
    // For ProductInfoAdmin Design
    // ======================
    productInfoSection: {
      sectionTitle: {
        type: String,
        trim: true,
        default: "Everything About This Product",
      },

      sectionSubtitle: {
        type: String,
        trim: true,
        default: "",
      },

      descriptionTitle: {
        type: String,
        trim: true,
        default: "",
      },

      description: {
        type: String,
        trim: true,
        default: "",
      },

      description2: {
        type: String,
        trim: true,
        default: "",
      },

      comparisonHeadings: {
        col1: {
          type: String,
          trim: true,
          default: "",
        },
        col2: {
          type: String,
          trim: true,
          default: "",
        },
      },

      comparisonRows: [
        {
          id: {
            type: Schema.Types.Mixed,
          },
          label: {
            type: String,
            trim: true,
            default: "",
          },
          value1: {
            type: String,
            trim: true,
            default: "",
          },
          value2: {
            type: String,
            trim: true,
            default: "",
          },
          saved: {
            type: Boolean,
            default: true,
          },
        },
      ],

      ingredients: [
        {
          id: {
            type: Schema.Types.Mixed,
          },
          value: {
            type: String,
            trim: true,
            default: "",
          },
          saved: {
            type: Boolean,
            default: true,
          },
        },
      ],

      usageIntro: {
        type: String,
        trim: true,
        default: "",
      },

      usageBlocks: [
        {
          id: {
            type: Schema.Types.Mixed,
          },
          title: {
            type: String,
            trim: true,
            default: "",
          },
          points: [
            {
              id: {
                type: Schema.Types.Mixed,
              },
              value: {
                type: String,
                trim: true,
                default: "",
              },
              saved: {
                type: Boolean,
                default: true,
              },
            },
          ],
          saved: {
            type: Boolean,
            default: true,
          },
        },
      ],

      benefits: [
        {
          id: {
            type: Schema.Types.Mixed,
          },
          value: {
            type: String,
            trim: true,
            default: "",
          },
          saved: {
            type: Boolean,
            default: true,
          },
        },
      ],

      storage: {
        type: String,
        trim: true,
        default: "",
      },
    },

    // ======================
    // A+ CONTENT SECTION
    // For APlusContentAdmin Design
    // ======================
    aPlusContent: {
      title: {
        type: String,
        trim: true,
        default: "",
      },

      subtitle: {
        type: String,
        trim: true,
        default: "",
      },

      images: [
        {
          id: {
            type: Schema.Types.Mixed,
          },

          image: {
            type: Schema.Types.Mixed,
            default: "",
          },

          url: {
            type: String,
            default: "",
          },

          alt: {
            type: String,
            trim: true,
            default: "",
          },

          title: {
            type: String,
            trim: true,
            default: "",
          },

          order: {
            type: Number,
            default: 0,
          },

          saved: {
            type: Boolean,
            default: true,
          },
        },
      ],
    },

    // ======================
    // SPECIAL SECTION
    // ======================
    specialSections: [
      {
        title: {
          type: String,
          trim: true,
          default: "",
        },

        desc: {
          type: String,
          trim: true,
          default: "",
        },

        description: {
          type: String,
          trim: true,
          default: "",
        },

        image: {
          type: Schema.Types.Mixed,
          default: "",
        },

        features: [
          {
            id: {
              type: Schema.Types.Mixed,
            },
            title: {
              type: String,
              trim: true,
              default: "",
            },
            desc: {
              type: String,
              trim: true,
              default: "",
            },
            saved: {
              type: Boolean,
              default: true,
            },
          },
        ],

        videos: [
          {
            id: {
              type: Schema.Types.Mixed,
            },

            video: {
              type: Schema.Types.Mixed,
              default: "",
            },

            url: {
              type: String,
              trim: true,
              default: "",
            },

            cover: {
              type: Schema.Types.Mixed,
              default: "",
            },

            title: {
              type: String,
              trim: true,
              default: "",
            },

            order: {
              type: Number,
              default: 0,
            },

            saved: {
              type: Boolean,
              default: true,
            },
          },
        ],

        points: [
          {
            type: String,
            trim: true,
          },
        ],

        buttonText: {
          type: String,
          trim: true,
          default: "",
        },

        buttonLink: {
          type: String,
          trim: true,
          default: "",
        },
      },
    ],

    // ======================
    // FAQ SECTION
    // ======================
    faqSection: {
      subtitle: {
        type: String,
        trim: true,
        default: "",
      },

      videos: [
        {
          id: {
            type: Schema.Types.Mixed,
          },

          video: {
            type: Schema.Types.Mixed,
            default: "",
          },

          url: {
            type: String,
            trim: true,
            default: "",
          },

          cover: {
            type: Schema.Types.Mixed,
            default: "",
          },

          title: {
            type: String,
            trim: true,
            default: "",
          },

          order: {
            type: Number,
            default: 0,
          },

          saved: {
            type: Boolean,
            default: true,
          },
        },
      ],

      faqs: [
        {
          question: {
            type: String,
            trim: true,
          },
          answer: {
            type: String,
            trim: true,
          },
        },
      ],
    },

    relatedProducts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    specificationTableId: String,

    metaTitle: String,
    metaDescription: String,

    isActive: { type: Boolean, default: true },

    // ======================
    // HIGHLIGHTS
    // ======================
    highlights: [
      {
        text: String,
      },
    ],

    // ======================
    // OFFERS
    // ======================
    offers: {
      title: String,
      description: String,
      discountPercentage: Number,
      couponCode: String,
      validTill: Date,
    },

    // ======================
    // TESTIMONIALS
    // ======================
    testimonials: [
      {
        name: String,
        message: String,
        rating: { type: Number, default: 5 },
        image: {
          type: Schema.Types.Mixed,
          default: "",
        },
      },
    ],

    // ======================
    // SECTION CONTROL
    // ======================
    sections: {
      showProductInfo: { type: Boolean, default: true },
      showAPlusContent: { type: Boolean, default: true },

      showSpecial: { type: Boolean, default: true },
      showFAQ: { type: Boolean, default: true },
      showTestimonials: { type: Boolean, default: true },
      showRelated: { type: Boolean, default: true },
      showHighlights: { type: Boolean, default: true },
      showOffers: { type: Boolean, default: true },
      showFeatures: { type: Boolean, default: true },
      showWhySection: { type: Boolean, default: true },
    },
  },
  {
    timestamps: true,
  }
);

// ======================
// AUTO SLUG
// ======================
productSchema.pre("save", function (next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
  }

  next();
});

// ======================
// VALIDATION
// ======================
productSchema.path("attributes").validate(function (value) {
  if (!Array.isArray(value)) return true;

  return value.filter((v) => v.isDefault).length <= 1;
}, "Only one default variant allowed");

// ======================
// PLUGINS
// ======================
productSchema.plugin(paginate);

// ======================
// INDEXES
// ======================
productSchema.index({ name: 1 });
productSchema.index({ slug: 1 });
productSchema.index({ categoryId: 1 });
productSchema.index({ brandId: 1 });
productSchema.index({ name: "text", description: "text" });
productSchema.index({ "inventory.status": 1 });
productSchema.index({ "inventory.warehouse": 1 });
productSchema.index({ "inventory.isVisible": 1 });

// ======================
// EXPORT
// ======================
const Product = model("Product", productSchema);

export default Product;
