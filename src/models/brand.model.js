import { Schema, model } from 'mongoose';

const brandSchema = new Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true 
},
  icon: {
    type: String,
  },
  subName: {
    type: String,
  },
  value: {
    type: String,
  }
});

const Brand = model('Brand', brandSchema);

export default Brand;
