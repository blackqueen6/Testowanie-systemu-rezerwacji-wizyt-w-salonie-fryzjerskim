import express from 'express';
import Service from '../models/ServiceSchema.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Service:
 *       type: object
 *       required:
 *         - category
 *         - name
 *         - price
 *         - maxPrice
 *         - time
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the service
 *         category:
 *           type: string
 *           description: The category of the service
 *         name:
 *           type: string
 *           description: The name of the service
 *         price:
 *           type: number
 *           description: The price of the service
 *         maxPrice:
 *           type: number
 *           description: The maximum price of the service
 *         time:
 *           type: number
 *           description: The duration of the service in minutes
 *       example:
 *         id: d5fE_asz
 *         category: Haircut
 *         name: Men's Haircut
 *         price: 20
 *         maxPrice: 30
 *         time: 45
 */

/**
 * @swagger
 * tags:
 *   name: Service
 *   description: The service managing API
 */

/**
 * @swagger
 * /api/services:
 *   get:
 *     summary: Get all services
 *     tags: [Service]
 *     responses:
 *       200:
 *         description: List of services
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Service'
 *       500:
 *         description: Error retrieving services
 */
router.get('/', async (req, res) => {
    try {
        const services = await Service.find();
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ message: 'Błąd podczas pobierania usług' });
    }
});

/**
 * @swagger
 * /api/services/getServicesByIds:
 *   post:
 *     summary: Get services by IDs
 *     tags: [Service]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *             example:
 *               ids: ["60d0fe4f5311236168a109ca", "60d0fe4f5311236168a109cb"]
 *     responses:
 *       200:
 *         description: List of services
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Service'
 *       500:
 *         description: Error retrieving services
 */
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