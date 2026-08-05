import { Schema, model } from 'mongoose';

const labelSchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: String,
});

const Label = model('LabelSchema', labelSchema);

export default Label;
