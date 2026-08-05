import { Schema, model } from 'mongoose';

const categorySchema = new Schema({
  name: { type: String, required: true, unique: true },
  image: { type: String }, 
  description: String,
});

const Category = model('Category', categorySchema);

export default Category;
