import Booking from '../models/BookingSchema.js';
import Hairdresser from '../models/HairdresserSchema.js';
import User from '../models/UserSchema.js';
import Service from '../models/ServiceSchema.js';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

const sendEmail = async (to, subject, text) => {
    const mailOptions = {
        from: process.env.EMAIL,
        to,
        subject,
        text
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

export const createReservation = async (req, res) => {
    try {
        const { appointmentDate, time, hairdresser, services } = req.body;
        const userId = req.userId;

        if (!time) {
            console.log('Godzina jest wymagana');
            return res.status(400).json({ message: 'Godzina jest wymagana' });
        }

        if (!services || services.length === 0) {
            console.log('Usługi są wymagane');
            return res.status(400).json({ message: 'Usługi są wymagane' });
        }

        const appointmentDateUTC = new Date(appointmentDate);
        const [hours, minutes] = time.split(':').map(Number);
        appointmentDateUTC.setUTCHours(hours, minutes, 0, 0);

        // Oblicza czas zakończenia wizyty
        const serviceDocs = await Promise.all(services.map(async (serviceId) => {
            const serviceDoc = await Service.findById(serviceId);
            if (!serviceDoc) {
                throw new Error(`Service not found: ${serviceId}`);
            }
            return serviceDoc;
        }));

        const totalServiceTime = serviceDocs.reduce((total, service) => total + service.time, 0);
        const endTime = new Date(appointmentDateUTC.getTime() + totalServiceTime * 60000);

        // Sprawdza, czy klient ma już rezerwację w danym czasie
        const existingUserBooking = await Booking.findOne({
            user: userId,
            $or: [
                {
                    appointmentDate: {
                        $lt: endTime,
                        $gte: appointmentDateUTC
                    }
                },
                {
                    appointmentDate: {
                        $lte: appointmentDateUTC,
                        $gt: new Date(appointmentDateUTC.getTime() - totalServiceTime * 60000)
                    }
                }
            ]
        });

        if (existingUserBooking) {
            console.log('Klient ma już rezerwację w tym terminie');
            return res.status(400).json({ success: false, message: 'Klient ma już rezerwację w tym terminie' });
        }

        // Sprawdza, czy fryzjer jest dostępny w danym dniu i godzinie
        const existingBooking = await Booking.findOne({
            hairdresser,
            $or: [
                {
                    appointmentDate: {
                        $lt: endTime,
                        $gte: appointmentDateUTC
                    }
                },
                {
                    appointmentDate: {
                        $lte: appointmentDateUTC,
                        $gt: new Date(appointmentDateUTC.getTime() - totalServiceTime * 60000)
                    }
                }
            ]
        });

        if (existingBooking) {
            console.log('Fryzjer jest już zajęty w tym terminie');
            return res.status(400).json({ success: false, message: 'Fryzjer jest już zajęty w tym terminie' });
        }

        const hairdresserDoc = await Hairdresser.findById(hairdresser);
        if (!hairdresserDoc) {
            console.log('Fryzjer nie znaleziony');
            return res.status(404).json({ message: 'Fryzjer nie znaleziony' });
        }
        if (hairdresserDoc.status === 'na_urlopie') {
            console.log('Fryzjer jest na urlopie');
            return res.status(400).json({ message: 'Fryzjer jest na urlopie' });
        }

        const userDoc = await User.findById(userId);
        if (!userDoc) {
            console.log('Użytkownik nie znaleziony');
            return res.status(404).json({ message: 'Użytkownik nie znaleziony' });
        }


        const newReservation = new Booking({
            appointmentDate: appointmentDateUTC,
            hairdresser,
            time,
            services: serviceDocs.map(service => service._id),
            user: userId,
            userName: userDoc.name,
            userEmail: userDoc.email,
            userPhone: userDoc.phone,
            reminderSent: false
        });

        await newReservation.save();

        // Konwersja pól createdAt i updatedAt na lokalny czas przed wysłaniem odpowiedzi
        const adjustedBooking = {
            ...newReservation.toObject(),
            createdAt: new Date(newReservation.createdAt).toLocaleString("pl-PL", { timeZone: "Europe/Warsaw" }),
            updatedAt: new Date(newReservation.updatedAt).toLocaleString("pl-PL", { timeZone: "Europe/Warsaw" })
        };

        // Wysyłanie e-maila z potwierdzeniem rezerwacji
        const emailText = `
            Potwierdzenie rezerwacji:
            Data: ${appointmentDateUTC.toLocaleDateString('pl-PL')}
            Godzina: ${time}
            Fryzjer: ${hairdresserDoc.name} ${hairdresserDoc.lastName}
            Usługi: ${serviceDocs.map(service => service.name).join(', ')}
            Adres: ul. Kokosowa 1, Tarnów
            tel. 530 787 553
            Można odwołać wizytę do 1 dnia przed planowanym terminem.
            Dziękujemy za rezerwację wizyty, pozdrawiamy zespół FryzGlam!
        `;
        await sendEmail(userDoc.email, 'Potwierdzenie rezerwacji', emailText);

        res.status(201).json(adjustedBooking);
    } catch (error) {
        console.error('Error creating reservation:', error);
        res.status(400).json({ message: error.message });
    }
};

const checkAndSendReminders = async () => {
    try {
        const now = new Date();
        const bookings = await Booking.find({ reminderSent: false }).populate('hairdresser services user');

        console.log(`Found ${bookings.length} bookings to check for reminders.`);

        bookings.forEach(async (booking) => {
            const [hours, minutes] = booking.time.split(':').map(Number);
            const appointmentDateTime = new Date(booking.appointmentDate);
            appointmentDateTime.setUTCHours(hours, minutes, 0, 0);

            const reminderDate = new Date(appointmentDateTime.getTime() - 24 * 60 * 60 * 1000);
            const delay = reminderDate.getTime() - now.getTime();


            if (delay > 0) {
                setTimeout(async () => {
                    const reminderText = `
                        Przypomnienie o wizycie:
                        Data: ${appointmentDateTime.toLocaleDateString('pl-PL')}
                        Godzina: ${booking.time}
                        Fryzjer: ${booking.hairdresser.name} ${booking.hairdresser.lastName}
                        Usługi: ${booking.services.map(service => service.name).join(', ')}
                        Zapraszamy, pozdrawiamy zespół FryzGlam!  
                    `;

                    try {
                        await sendEmail(booking.user.email, 'Przypomnienie o wizycie', reminderText);
                        console.log('Reminder email sent successfully');

                        // Aktualizacja pola reminderSent
                        booking.reminderSent = true;
                        await booking.save();
                    } catch (error) {
                        console.error('Error sending reminder email:', error);
                    }
                }, delay);
            } else {
                console.log('Less than 24 hours to the appointment, no reminder will be sent.');
            }
        });
    } catch (error) {
        console.error('Error checking and sending reminders:', error);
    }
};

// Wywołanie funkcji checkAndSendReminders co 15 minut
setInterval(checkAndSendReminders, 15 * 60 * 1000);

// pobieranie rezerwacji zalogowanego użytkownika
export const getReservations = async (req, res) => {
    try {
        const reservations = await Booking.find({ user: req.userId });
        res.status(200).json(reservations);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getReservationsByHairdresserAndDate = async (req, res) => {
    const { hairdresserId, date } = req.params;
    try {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const reservations = await Booking.find({
            hairdresser: hairdresserId,
            appointmentDate: { $gte: startOfDay, $lte: endOfDay }
        }).populate('services');

        // Konwersja czasu UTC na lokalny czas
        const localReservations = reservations.map(reservation => {
            const localCreatedAt = new Date(reservation.createdAt).toLocaleString('pl-PL', { timeZone: 'Europe/Warsaw' });
            const localUpdatedAt = new Date(reservation.updatedAt).toLocaleString('pl-PL', { timeZone: 'Europe/Warsaw' });
            return {
                ...reservation.toObject(),
                createdAt: localCreatedAt,
                updatedAt: localUpdatedAt
            };
        });

        res.status(200).json(localReservations);
    } catch (error) {
        res.status(500).json({ message: 'Błąd podczas pobierania rezerwacji', error });
    }
};

export const deleteReservation = async (req, res) => {
    const { id } = req.params;
    console.log(`Received request to delete booking with id: ${id}`);
    try {
        const deleted = await Booking.findByIdAndDelete(id);
        if (deleted) {
            res.status(200).json({ success: true, message: 'Usunięto pomyślnie' });
        } else {
            res.status(404).json({ success: false, message: 'Nie znaleziono rezerwacji' });
        }
    } catch (error) {
        console.error(`Błąd: ${error.message}`);
        res.status(500).json({ success: false, message: 'Nie usunięto pomyślnie' });
    }
};

// Aktualizacja rezerwacji
export const updateReservation = async (req, res) => {
    const { id } = req.params;
    const { appointmentDate, time, hairdresser, services } = req.body;
    try {
        const updatedReservation = await Booking.findByIdAndUpdate(
            id,
            { appointmentDate, time, hairdresser, services },
            { new: true }
        );
        if (!updatedReservation) {
            return res.status(404).json({ success: false, message: 'Nie znaleziono rezerwacji' });
        }
        res.status(200).json({ success: true, message: 'Rezerwacja zaktualizowana pomyślnie', updatedReservation });
    } catch (error) {
        console.error(`Błąd: ${error.message}`);
        res.status(500).json({ success: false, message: 'Nie zaktualizowano pomyślnie' });
    }
};

// Pobieranie wszystkich rezerwacji
export const getAllReservations = async (req, res) => {
    try {
        const reservations = await Booking.find().populate('user hairdresser services');
        res.status(200).json(reservations);
    } catch (error) {
        res.status(500).json({ message: 'Błąd podczas pobierania rezerwacji', error });
    }
};

// Pobieranie rezerwacji dla konkretnego użytkownika
export const getReservationsByUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const reservations = await Booking.find({ user: userId }).populate('services');
        res.status(200).json(reservations);
    } catch (error) {
        res.status(500).json({ message: 'Błąd podczas pobierania rezerwacji', error });
    }
};