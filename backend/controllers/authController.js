import User from "../models/UserSchema.js";
import Hairdresser from "../models/HairdresserSchema.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import nodemailer from 'nodemailer';
import crypto from 'crypto';

// Funkcja do generowania tokenu JWT
const generateToken = user => {
    return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET_KEY, {
        expiresIn: '15d'
    });
}

// Rejestracja użytkownika
export const register = async (req, res) => {
    const { email, password, name, lastName, phone, role, gender, status, description, photo } = req.body;
    try {

        if (!email || !password || !name || !lastName || !role) {
            return res.status(400).json({ message: "Proszę podać wszystkie wymagane pola" });
        }

        let user = null;
        if (role === 'klient') {
            user = await User.findOne({ email });
        } else if (role === 'fryzjer') {
            user = await Hairdresser.findOne({ email });
        }
        if (user) {
            console.log("Użytkownik już istnieje");
            return res.status(400).json({ message: "Taki użytkownik już istnieje" });
        }

        // Hashowanie hasła
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        if (role === 'klient') {
            user = new User({
                email,
                password: hashedPassword,
                name,
                lastName,
                phone,
                gender: gender || undefined,
                role,
            });
        } if (role === 'fryzjer') {
            user = new Hairdresser({
                email,
                password: hashedPassword,
                name,
                lastName,
                phone,
                gender: gender || undefined,
                role,
                status: status || 'w_pracy',
                description: description || '',
                photo: photo || ''
            });
        }
        await user.save();
        res.status(201).json({ success: true, message: "Użytkownik został zarejestrowany" });

    } catch (error) {
        console.error("Błąd podczas rejestracji:", error);
        res.status(500).json({ success: false, message: "Coś poszło nie tak, spróbuj ponownie." });
    }
};

// Logowanie użytkownika
export const login = async (req, res) => {
    const { email } = req.body;
    try {
        let user = null;
        const client = await User.findOne({ email });
        const hairdresser = await Hairdresser.findOne({ email });
        if (client) {
            user = client;
        } else if (hairdresser) {
            user = hairdresser;
        }

        if (!user) {
            return res.status(400).json({ message: "Nieprawidłowy email lub hasło" });
        }

        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Nieprawidłowy email lub hasło" });
        }

        // Generowanie tokenu JWT
        const token = generateToken(user);
        const { password, role, appointments, ...rest } = user._doc;

        res.status(200).json({ status: true, message: "Zalogowano pomyślnie", token, data: { ...rest }, role });

    } catch (error) {
        res.status(500).json({ status: false, message: "Coś poszło nie tak, spróbuj ponownie." });
    }
};

// Resetowanie hasła
export const resetPassword = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({ message: 'Użytkownik nie znaleziony' });
    }

    const resetCode = crypto.randomBytes(3).toString('hex').toUpperCase();
    user.resetCode = resetCode;
    await user.save();

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Kod resetowania hasła',
        text: `Twój kod resetowania hasła to: ${resetCode}`
    };


    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Błąd podczas wysyłania emaila:', error);
            return res.status(500).json({ message: 'Błąd podczas wysyłania emaila' });
        }
        console.log('Email wysłany:', info.response);
        res.status(200).json({ message: 'Kod weryfikacyjny został wysłany na email' });
    });
};

// Weryfikacja kodu resetowania hasła
export const verifyResetCode = async (req, res) => {
    const { email, code } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(400).json({ message: 'Użytkownik nie znaleziony' });
    }


    if (user.resetCode !== code) {
        return res.status(400).json({ message: 'Nieprawidłowy kod weryfikacyjny' });
    }

    res.status(200).json({ message: 'Kod weryfikacyjny został zweryfikowany' });
};

// Aktualizacja hasła
export const updatePassword = async (req, res) => {
    const { email, code, newPassword } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.resetCode !== code) {
        return res.status(400).json({ message: 'Nieprawidłowy kod weryfikacyjny' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetCode = undefined; // Usunięcie kodu resetowania po zmianie hasła
    await user.save();

    res.status(200).json({ message: 'Hasło zostało zmienione' });
};