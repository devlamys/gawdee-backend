import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    customerName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    alternateNumber: { type: String },
    email: { type: String, required: true },
    warranty: { type: String },
    pinCode: { type: Number },
    address: { type: String, required: true },
    message: { type: String},
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

const Complaint = mongoose.model("Complaint", complaintSchema);
export default Complaint;
