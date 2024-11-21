import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: Number, required: true },
  role: {
    type: String,
    enum: ["klient", "fryzjer"],
    default: "klient",
  },
  gender: { type: String, enum: ["kobieta", "mężczyzna"], required: false },
  resetCode: {
    type: String
  }
});

export default mongoose.model("User", UserSchema);

