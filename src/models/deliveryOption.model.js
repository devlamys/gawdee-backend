import mongoose from 'mongoose';

const deliveryOptionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    estimatedDays: {
      type: String,
      required: true,
      trim: true,
    },

    available: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const DeliveryOption = mongoose.model(
  'DeliveryOption',
  deliveryOptionSchema
);

export default DeliveryOption;