import request from 'supertest';
import app from '../index.js';
import User from '../models/UserSchema.js';

//testy integracyjne
describe('Auth Controller', () => {
    let token;
    let resetCode;

    afterAll(async () => {
        // Usuwanie konta testowego
        await User.deleteMany({ email: { $in: ['newuser@example.com'] } });
    });

    it('powinien zarejestrować nowego użytkownika', async () => {
        // Given
        const newUser = {
            name: 'New',
            lastName: 'User',
            email: 'newuser@example.com',
            phone: '123456789',
            password: 'Password1',
            role: 'klient'
        };

        // When
        const res = await request(app)
            .post('/api/auth/register')
            .send(newUser);

        // Then
        console.log('Użytkownik zarejestrowany');
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('success', true);
        expect(res.body.message).toBe('Użytkownik został zarejestrowany');
    });

    it('powinien zalogować użytkownika', async () => {
        // Given
        const loginUser = {
            email: 'newuser@example.com',
            password: 'Password1'
        };

        // When
        const res = await request(app)
            .post('/api/auth/login')
            .send(loginUser);

        // Then
        console.log('Użytkownik zalogowany');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('status', true);
        expect(res.body.message).toBe('Zalogowano pomyślnie');
        token = res.body.token;
    });

    it('powinien wysłać kod do zresetowania hasła', async () => {
        // Given
        const resetRequest = {
            email: 'newuser@example.com'
        };

        // When
        const res = await request(app)
            .post('/api/auth/reset-password')
            .send(resetRequest);

        // Then
        console.log('Email z kodem resetowania wysłany');
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toBe('Kod weryfikacyjny został wysłany na email');

        // Pobieranie kodu resetowania z bazy danych
        const user = await User.findOne({ email: 'newuser@example.com' });
        resetCode = user.resetCode;
    });

    it('powinien zweryfikować kod resetowania', async () => {
        // Given
        const verifyRequest = {
            email: 'newuser@example.com',
            code: resetCode
        };

        // When
        const res = await request(app)
            .post('/api/auth/verify-reset-code')
            .send(verifyRequest);

        // Then
        console.log('Kod resetowania zweryfikowany');
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toBe('Kod weryfikacyjny został zweryfikowany');
    });

    it('powinien zaktualizować hasło', async () => {
        // Given
        const updateRequest = {
            email: 'newuser@example.com',
            code: resetCode,
            newPassword: 'NewPassword2'
        };

        // When
        const res = await request(app)
            .put('/api/auth/reset-password')
            .send(updateRequest);

        // Then
        console.log('Hasło zaktualizowane');
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toBe('Hasło zostało zmienione');
    });
});