import mongoose from "mongoose";

const HairdresserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: Number },
  role: { type: String },
  gender: { type: String },
  specialization: { type: String },
  description: { type: String },
  photo: { type: String },
  timeSlots: { type: Array },
  status: {
    type: String,
    enum: ["w_pracy", "na_urlopie"],
    default: "w_pracy",
  }
});

export default mongoose.model("Hairdresser", HairdresserSchema);