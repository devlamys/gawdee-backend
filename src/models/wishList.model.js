import { Schema, model } from 'mongoose';

const wishListSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  products: [{ type: Schema.Types.ObjectId, ref: 'Product' }]
}, { timestamps: true });

const WishList = model('WishList', wishListSchema);

export default WishList;