import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    hairdresser: {
      type: mongoose.Types.ObjectId,
      ref: "Hairdresser",
      required: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    services: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true
    }],
    time: {
      type: String,
      required: true,
    },
    appointmentDate: {
      type: Date,
      required: true,
    },
    userName: {
      type: String,
      required: true
    },
    userEmail: {
      type: String,
      required: true
    },
    userPhone: {
      type: String,
      required: true
    },
    reminderSent: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const Booking = mongoose.model('Booking', BookingSchema);

export default Booking;