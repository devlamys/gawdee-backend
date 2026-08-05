import mongoose from 'mongoose';

const productCodeSchema = new mongoose.Schema({
  code: { type: String, unique: true, required: true },
  used: { type: Boolean, default: false },
  usedBy: {
    mobileNumber: String,
    name: String,
    appliedAt: Date,
  },
}, { timestamps: true });

const Code = mongoose.model('Code', productCodeSchema);
export default Code;