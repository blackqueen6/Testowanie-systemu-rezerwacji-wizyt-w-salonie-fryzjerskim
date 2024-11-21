import mongoose from 'mongoose';

const openingHoursSchema = new mongoose.Schema({
    day: {
        type: String,
        required: true,
    },
    hours: {
        type: String,
        required: true,
    },
});

const OpeningHours = mongoose.model('OpeningHours', openingHoursSchema);

export default OpeningHours;