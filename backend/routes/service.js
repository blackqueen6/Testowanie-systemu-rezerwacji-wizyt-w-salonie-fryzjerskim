import express from 'express';
import Service from '../models/ServiceSchema.js';

const router = express.Router();

// Endpoint do pobierania wszystkich usług
router.get('/', async (req, res) => {
    try {
        const services = await Service.find();
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ message: 'Błąd podczas pobierania usług' });
    }
});

// Endpoint do pobierania usług na podstawie identyfikatorów
router.post('/getServicesByIds', async (req, res) => {
    try {
        const { ids } = req.body;
        const services = await Service.find({ _id: { $in: ids } });
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ message: 'Błąd podczas pobierania usług', error });
    }
});

export default router;