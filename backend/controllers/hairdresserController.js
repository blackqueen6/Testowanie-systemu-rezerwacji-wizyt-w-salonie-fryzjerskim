import Hairdresser from "../models/HairdresserSchema.js";
import Booking from "../models/BookingSchema.js";
import mongoose from 'mongoose';


export const deleteHairdresser = async (req, res) => {
    const { id } = req.params;
    try {
        await Hairdresser.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: 'Usunięto pomyślnie' });
    } catch (error) {
        console.error(`Błąd: ${error.message}`);
        res.status(500).json({ success: false, message: 'Nie usunięto pomyślnie' });
    }
};


export const getAllHairdresser = async (req, res) => {
    try {
        const hairdressers = await Hairdresser.find({}).select('-password');
        res.status(200).json({ success: true, message: 'Znaleziono użytkowników', data: hairdressers });
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(404).json({ success: false, message: 'Nie znaleziono użytkowników' });
    }
};

// Pobierz profil fryzjera
export const getHairdresserProfile = async (req, res) => {
    const { id } = req.params;
    try {
        const hairdresser = await Hairdresser.findById(id).select('-password');
        if (!hairdresser) {
            return res.status(404).json({ message: 'Fryzjer nie znaleziony' });
        }
        const appointments = await Booking.find({ hairdresser: id });
        res.status(200).json({ success: true, message: 'Pobieram informacje o profilu', data: { ...hairdresser._doc, appointments } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Coś poszło nie tak' });
    }
};


// Pobierz wizyty fryzjera
export const getHairdresserAppointments = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.userId)) {
            return res.status(400).json({ message: 'Invalid hairdresser ID' });
        }
        const appointments = await Booking.find({ hairdresser: req.userId }).populate('user', 'name lastName phone email');
        if (!appointments || appointments.length === 0) {
            return res.status(404).json({ success: false, message: 'Nie masz jeszcze żadnych zarezerwowanych wizyt' });
        }
        res.status(200).json({ success: true, message: 'Znaleziono wizyty', data: appointments });
    } catch (error) {
        console.error(`Server error: ${error.message}`);
        res.status(500).json({ message: 'Błąd serwera', error });
    }
};
