import User from "../models/UserSchema.js";
import Booking from "../models/BookingSchema.js";


export const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        await User.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: 'Usunięto pomyślnie' });
    } catch (error) {
        console.error(`Błąd: ${error.message}`);
        res.status(500).json({ success: false, message: 'Nie usunięto pomyślnie' });
    }
}

export const getUserProfile = async (req, res) => {
    const userId = req.userId;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Nie znaleziono użytkownika' });
        }

        const { password, ...rest } = user._doc;
        res.status(200).json({ success: true, message: 'Pobieram informacje o profilu', data: { ...rest } });
    } catch (error) {
        console.error(`Błąd: ${error.message}`);
        res.status(500).json({ success: false, message: 'Coś poszło nie tak' });
    }
};

export const getMyAppointments = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.userId })
            .populate('hairdresser', 'name lastName email phone')
            .select('-hairdresser.password');

        const sanitizedBookings = bookings.map(booking => ({
            _id: booking._id,
            hairdresser: booking.hairdresser,
            services: booking.services,
            appointmentDate: booking.appointmentDate,
            time: booking.time,
            userName: booking.userName,
            userEmail: booking.userEmail,
            userPhone: booking.userPhone,
            updatedAt: booking.updatedAt
        }));

        res.status(200).json({ success: true, message: 'Pobiera umówione wizyty', data: sanitizedBookings });
    } catch (error) {
        console.error(`Błąd: ${error.message}`);
        res.status(500).json({ success: false, message: 'Coś poszło nie tak' });
    }
};
