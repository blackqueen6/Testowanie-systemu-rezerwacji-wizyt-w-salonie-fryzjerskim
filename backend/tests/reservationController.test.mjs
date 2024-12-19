import { jest } from '@jest/globals';
import mongoose from 'mongoose';
import { createReservation } from '../controllers/reservationController.js';
import { getMyAppointments } from '../controllers/userController.js';
import Booking from '../models/BookingSchema.js';
import Hairdresser from '../models/HairdresserSchema.js';
import User from '../models/UserSchema.js';
import Service from '../models/ServiceSchema.js';

// testy jednostkowe
describe('createReservation', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {
                appointmentDate: '2024-12-23',
                time: '13:00',
                hairdresser: new mongoose.Types.ObjectId(),
                services: [new mongoose.Types.ObjectId()]
            },
            userId: new mongoose.Types.ObjectId()
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    it('powinien utworzyć nową rezerwację', async () => {
        // Given: Mockowanie danych
        jest.spyOn(User, 'findById').mockResolvedValue({ name: 'John', email: 'john@example.com', phone: '123456789' });
        jest.spyOn(Hairdresser, 'findById').mockResolvedValue({ name: 'Anna', lastName: 'Kowalska', status: 'w_pracy' });
        jest.spyOn(Service, 'findById').mockResolvedValue({ _id: new mongoose.Types.ObjectId(), time: 60 });
        jest.spyOn(Booking, 'findOne').mockResolvedValue(null);
        jest.spyOn(Booking.prototype, 'save').mockResolvedValue({ _id: new mongoose.Types.ObjectId(), createdAt: new Date(), updatedAt: new Date() });

        // When
        await createReservation(req, res);

        // Then
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            _id: expect.any(mongoose.Types.ObjectId)
        }));
    });

    it('nie powinien utworzyć rezerwacji, jeśli klient ma już rezerwację w tym terminie', async () => {
        // Given
        jest.spyOn(Booking, 'findOne').mockResolvedValue({});

        // When
        await createReservation(req, res);

        // Then
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Klient ma już rezerwację w tym terminie' });
    });

    it('nie powinien utworzyć rezerwacji, jeśli fryzjer jest już zajęty w tym terminie', async () => {
        // Given
        jest.spyOn(Booking, 'findOne').mockResolvedValueOnce(null).mockResolvedValueOnce({});

        // When
        await createReservation(req, res);

        // Then
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Fryzjer jest już zajęty w tym terminie' });
    });

    it('nie powinien utworzyć rezerwacji, jeśli fryzjer jest na urlopie', async () => {
        // Given
        jest.spyOn(Hairdresser, 'findById').mockResolvedValue({ name: 'Anna', lastName: 'Kowalska', status: 'na_urlopie' });

        // Given
        jest.spyOn(Booking, 'findOne').mockResolvedValue(null);

        // When
        await createReservation(req, res);

        // Then
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Fryzjer jest na urlopie' });
    });

    it('nie powinien utworzyć rezerwacji, jeśli usługi są wymagane', async () => {
        // Given
        req.body.services = [];

        // Given: Brak istniejącej rezerwacji klienta
        jest.spyOn(Booking, 'findOne').mockResolvedValue(null);

        // When
        await createReservation(req, res);

        // Then
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Usługi są wymagane' });
    });
});

describe('getMyAppointments', () => {
    let req, res;

    beforeEach(() => {
        req = {
            userId: new mongoose.Types.ObjectId()
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    it('powinien zwrócić umówione wizyty użytkownika', async () => {
        // Given
        const mockPopulate = jest.fn().mockReturnThis();
        const mockSelect = jest.fn().mockResolvedValue([{ _id: new mongoose.Types.ObjectId(), appointmentDate: '2024-12-23', time: '13:00' }]);
        jest.spyOn(Booking, 'find').mockReturnValue({ populate: mockPopulate, select: mockSelect });

        // When
        await getMyAppointments(req, res);

        // Then
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: 'Pobiera umówione wizyty',
            data: [{ _id: expect.any(mongoose.Types.ObjectId), appointmentDate: '2024-12-23', time: '13:00' }]
        });
    });
});


