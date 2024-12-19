import request from 'supertest';
import app from '../index.js';
import Booking from '../models/BookingSchema.js';

//testy integracyjne
describe('Reservation Controller', () => {
    let token;
    let hairdresserToken;
    let existingHairdresserId = '6705994e43610a81f67bc17a';
    let existingServiceId = '6705a85cd26668616ac5c880';
    let bookingId;

    beforeAll(async () => {
        // Logowanie istniejącego użytkownika
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'jula45810@gmail.com', password: '7890' });

        token = res.body.token;

        // Logowanie fryzjera
        const hairdresserRes = await request(app)
            .post('/api/auth/login')
            .send({ email: 'anna.kowalska@gmail.com', password: 'admin35' });

        hairdresserToken = hairdresserRes.body.token;
    }, 10000);

    it('powinien utworzyć nową rezerwację', async () => {
        // Given
        const newReservation = {
            appointmentDate: '2024-12-23',
            time: '13:00',
            hairdresser: existingHairdresserId,
            services: [existingServiceId]
        };

        // When
        const res = await request(app)
            .post('/api/reservations')
            .set('Authorization', `Bearer ${token}`)
            .send(newReservation);

        // Then
        console.log('Rezerwacja utworzona');
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('_id');
        bookingId = res.body._id;
    }, 10000);

    it('powinien zaktualizować rezerwację przez fryzjera', async () => {
        // Given
        const updatedReservation = {
            appointmentDate: '2024-12-23',
            time: '14:00',
            hairdresser: existingHairdresserId,
            services: [existingServiceId]
        };

        // When
        const res = await request(app)
            .put(`/api/reservations/bookings/${bookingId}`)
            .set('Authorization', `Bearer ${hairdresserToken}`)
            .send(updatedReservation);

        // Then
        console.log('Rezerwacja zaktualizowana');
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toBe('Rezerwacja zaktualizowana pomyślnie');
        expect(res.body.updatedReservation).toHaveProperty('_id', bookingId);
        expect(res.body.updatedReservation).toHaveProperty('appointmentDate', new Date(updatedReservation.appointmentDate).toISOString());
        expect(res.body.updatedReservation).toHaveProperty('time', updatedReservation.time);
    }, 10000);

    it('powinien usunąć rezerwację', async () => {
        // When
        const res = await request(app)
            .delete(`/api/reservations/bookings/${bookingId}`)
            .set('Authorization', `Bearer ${token}`);

        // Then
        console.log('Rezerwacja usunięta');
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toBe('Usunięto pomyślnie');

        // Sprawdzenie, czy rezerwacja została usunięta z bazy danych
        const deletedReservation = await Booking.findById(bookingId);
        expect(deletedReservation).toBeNull();
    }, 10000);

    it('nie powinien utworzyć rezerwacji bez godziny', async () => {
        // Given
        const newReservation = {
            appointmentDate: '2024-12-27',
            hairdresser: existingHairdresserId,
            services: [existingServiceId],
            time: ''
        };

        // When
        const res = await request(app)
            .post('/api/reservations')
            .set('Authorization', `Bearer ${token}`)
            .send(newReservation);

        // Then
        console.log('Rezerwacja bez godziny');
        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toBe('Godzina jest wymagana');
    }, 10000);

    it('nie powinien utworzyć rezerwacji, jeśli klient ma już rezerwację w tym terminie', async () => {
        // Given
        const newReservation = {
            appointmentDate: '2024-12-31',
            time: '10:00',
            hairdresser: existingHairdresserId,
            services: [existingServiceId]
        };

        //When Tworzenie pierwszej rezerwacji
        await request(app)
            .post('/api/reservations')
            .set('Authorization', `Bearer ${token}`)
            .send(newReservation);

        // Próba utworzenia drugiej rezerwacji w tym samym terminie
        const res = await request(app)
            .post('/api/reservations')
            .set('Authorization', `Bearer ${token}`)
            .send(newReservation);

        // Then
        console.log('Rezerwacja w tym samym terminie');
        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toBe('Klient ma już rezerwację w tym terminie');
    }, 10000);
});