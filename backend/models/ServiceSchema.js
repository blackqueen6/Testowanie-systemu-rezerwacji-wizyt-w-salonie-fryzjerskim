import mongoose from 'mongoose';

const ServiceSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    maxPrice: {
        type: Number,
        required: true,
    },
    time: {
        type: Number,
        required: true,
    },
}, { timestamps: true });

export default mongoose.model('Service', ServiceSchema);