import mongoose, { Schema, model } from 'mongoose';

const cartSchema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true },
        mrp:   { type: Number, required: true },
        selectedColor: { type: String },
        selectedColorImage: { type: String },
      },
    ],
    totalPrice: { type: Number, default: 0 },
    status: { type: String, enum: ['complete', 'incomplete'], default: 'incomplete' },
  },
  { timestamps: true }
);

const Cart = model('Cart', cartSchema);

export default Cart;
