import express from 'express';
import OpeningHours from '../models/OpeningHours.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     OpeningHours:
 *       type: object
 *       required:
 *         - day
 *         - hours
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the opening hours
 *         day:
 *           type: string
 *           description: The day of the week
 *         hours:
 *           type: string
 *           description: The opening hours for the day
 *       example:
 *         id: d5fE_asz
 *         day: monday
 *         hours: 09:00-17:00
 */

/**
 * @swagger
 * tags:
 *   name: OpeningHours
 *   description: The opening hours managing API
 */

/**
 * @swagger
 * /api/openingHours/add:
 *   post:
 *     summary: Add new opening hours
 *     tags: [OpeningHours]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/OpeningHours'
 *     responses:
 *       201:
 *         description: Opening hours added successfully
 *       500:
 *         description: Error adding opening hours
 */
router.post('/add', async (req, res) => {
    try {
        const openingHours = req.body;
        const result = await OpeningHours.insertMany(openingHours);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Błąd podczas dodawania godzin otwarcia', error });
    }
});

/**
 * @swagger
 * /api/openingHours:
 *   get:
 *     summary: Get all opening hours
 *     tags: [OpeningHours]
 *     responses:
 *       200:
 *         description: List of opening hours
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OpeningHours'
 *       500:
 *         description: Error retrieving opening hours
 */
router.get('/', async (req, res) => {
    try {
        const openingHours = await OpeningHours.find();
        res.status(200).json(openingHours);
    } catch (error) {
        res.status(500).json({ message: 'Błąd podczas pobierania godzin otwarcia', error });
    }
});

export default router;