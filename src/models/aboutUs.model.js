import { Schema, model } from "mongoose";

const featureSchema = new Schema(
  {
    icon: String,
    text: String,
  },
  { _id: false }
);

const galleryImageSectionSchema = new Schema(
  {
    sectionTitle: {
      type: String,
      default: "",
    },
    images: {
      type: [String],
      default: [],
    },
  },
  { _id: false }
);

const aboutUsSchema = new Schema(
  {
    hero: {
      title: String,
      highlight: String,
      description: String,
      image: String,
      visible: {
        type: Boolean,
        default: true,
      },
      features: [featureSchema],
    },

    youtubeSection: {
      title: String,
      desc: String,
      visible: {
        type: Boolean,
        default: true,
      },
      videos: [
        {
          url: String,
          embed: String,
        },
      ],
    },

    journeySection: {
      title: String,
      description: String,
      steps: [
        {
          title: String,
          desc: String,
          image: String,
        },
      ],
      visible: {
        type: Boolean,
        default: true,
      },
    },

    // ✅ UPDATED GALLERY SECTION - SECTION WISE
    gallerySection: {
      title: {
        type: String,
        default: "Moments From Our Farm",
      },
      description: {
        type: String,
        default:
          "From nurturing Gir cows to the traditional Bilona process, every step reflects purity and care.",
      },

      // ✅ new section-wise images
      sections: {
        type: [galleryImageSectionSchema],
        default: [],
      },

      // ✅ old support if your old data has direct images
      images: {
        type: [String],
        default: [],
      },

      visible: {
        type: Boolean,
        default: true,
      },
    },

    comboSection: {
      title: String,
      description: String,
      combos: [
        {
          title: String,
          desc: String,
          image1: String,
          image2: String,
          features: [String],
          price: String,
          discountPrice: String,
        },
      ],
      visible: {
        type: Boolean,
        default: true,
      },
    },
  },
  { timestamps: true }
);

export const AboutUs = model("AboutUs", aboutUsSchema);