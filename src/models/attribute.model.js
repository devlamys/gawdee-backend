import { Schema, model } from 'mongoose';

const attributeSchema = new Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true 
},
  value: {
    type: String,
    required: true,
  }
});

const Attribute = model('Attribute', attributeSchema);

export default Attribute;
