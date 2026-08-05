import mongoose from "mongoose";

const influencerVisitSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  whatsappNumber: { type: String, required: true },
  email: { type: String, required: true },
  visitDate: { type: Date, required: true },
  numberOfPeople: { type: Number, required: true },
  instagramURL: { type: String },
  facebookURL: { type: String },
  youtubeURL: { type: String },
  additionalNotes: { type: String },
}, { timestamps: true });

const InfluencerVisit = mongoose.model("InfluencerVisit", influencerVisitSchema);
export default InfluencerVisit;
