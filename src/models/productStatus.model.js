import { Schema, model } from 'mongoose';

const productStatusSchema = new Schema({
  status: { type: [String], required: true, unique: true },
});

const ProductStatus = model('ProductStatus', productStatusSchema);

export default ProductStatus;
