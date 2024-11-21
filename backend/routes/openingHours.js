import express from 'express';
import OpeningHours from '../models/OpeningHours.js';

const router = express.Router();


router.post('/add', async (req, res) => {
    try {
        const openingHours = req.body;
        const result = await OpeningHours.insertMany(openingHours);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Błąd podczas dodawania godzin otwarcia', error });
    }
});

router.get('/', async (req, res) => {
    try {
        const openingHours = await OpeningHours.find();
        res.status(200).json(openingHours);
    } catch (error) {
        res.status(500).json({ message: 'Błąd podczas pobierania godzin otwarcia', error });
    }
});
export default router;