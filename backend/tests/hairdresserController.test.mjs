import { jest } from '@jest/globals';
import mongoose from 'mongoose';
import { deleteHairdresser, getHairdresserTimeSlots, getHairdresserAppointments } from '../controllers/hairdresserController.js';
import Hairdresser from '../models/HairdresserSchema.js';
import Booking from '../models/BookingSchema.js';

//testy jednostkowe
describe('Hairdresser Controller', () => {
    let req, res;

    beforeEach(() => {
        req = {
            params: { id: new mongoose.Types.ObjectId() },
            userId: new mongoose.Types.ObjectId()
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    describe('deleteHairdresser', () => {
        it('powinien usunąć fryzjera', async () => {
            // Given
            jest.spyOn(Hairdresser, 'findByIdAndDelete').mockResolvedValue({});

            // When
            await deleteHairdresser(req, res);

            // Then
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Usunięto pomyślnie' });
        });

        it('powinien zwrócić błąd, jeśli usunięcie fryzjera się nie powiodło', async () => {
            // Given
            jest.spyOn(Hairdresser, 'findByIdAndDelete').mockRejectedValue(new Error('Błąd usuwania'));

            // When
            await deleteHairdresser(req, res);

            // Then
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Nie usunięto pomyślnie' });
        });
    });


    describe('getHairdresserTimeSlots', () => {
        it('powinien zwrócić harmonogram fryzjera', async () => {
            // Given
            jest.spyOn(Hairdresser, 'findById').mockResolvedValue({ timeSlots: ['09:00', '10:00'] });

            // When
            await getHairdresserTimeSlots(req, res);

            // Then
            expect(res.json).toHaveBeenCalledWith({ timeSlots: ['09:00', '10:00'] });
        });

    });

    describe('getHairdresserAppointments', () => {
        it('powinien zwrócić wizyty fryzjera', async () => {
            // Given
            const mockPopulate = jest.fn().mockResolvedValue([{ date: '2024-12-23' }]);
            jest.spyOn(Booking, 'find').mockReturnValue({ populate: mockPopulate });

            // When
            await getHairdresserAppointments(req, res);

            // Then
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Znaleziono wizyty', data: [{ date: '2024-12-23' }] });
        });

        it('powinien zwrócić błąd, jeśli ID fryzjera jest nieprawidłowe', async () => {
            // Given
            req.userId = 'invalid_id';

            // When
            await getHairdresserAppointments(req, res);

            // Then
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Invalid hairdresser ID' });
        });
    });
});