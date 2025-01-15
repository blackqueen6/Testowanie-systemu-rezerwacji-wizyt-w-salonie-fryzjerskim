import express from 'express';
import { deleteHairdresser, getAllHairdresser, getHairdresserProfile, getHairdresserAppointments, getHairdresserTimeSlots } from '../controllers/hairdresserController.js';
import { authenticate, restrick } from '../auth/verifyToken.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Hairdresser:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - name
 *         - lastName
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the hairdresser
 *         email:
 *           type: string
 *           description: The email of the hairdresser
 *         password:
 *           type: string
 *           description: The password of the hairdresser
 *         name:
 *           type: string
 *           description: The name of the hairdresser
 *         lastName:
 *           type: string
 *           description: The last name of the hairdresser
 *         phone:
 *           type: number
 *           description: The phone number of the hairdresser
 *         role:
 *           type: string
 *           description: The role of the hairdresser
 *         gender:
 *           type: string
 *           description: The gender of the hairdresser
 *         specialization:
 *           type: string
 *           description: The specialization of the hairdresser
 *         description:
 *           type: string
 *           description: The description of the hairdresser
 *         photo:
 *           type: string
 *           description: The photo of the hairdresser
 *         timeSlots:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               day:
 *                 type: string
 *                 description: The day of the week
 *               start:
 *                 type: string
 *                 description: The start time
 *               end:
 *                 type: string
 *                 description: The end time
 *           description: The available time slots of the hairdresser
 *         status:
 *           type: string
 *           enum: [w_pracy, na_urlopie]
 *           description: The status of the hairdresser
 *       example:
 *         id: d5fE_asz
 *         email: john.doe@example.com
 *         password: secret
 *         name: John
 *         lastName: Doe
 *         phone: 123456789
 *         role: fryzjer
 *         gender: mężczyzna
 *         specialization: Strzyżenie
 *         description: Doświadczony fryzjer
 *         photo: url_to_photo
 *         timeSlots: [
 *           { day: "monday", start: "11:00", end: "19:00" },
 *           { day: "tuesday", start: "11:00", end: "19:00" },
 *           { day: "wednesday", start: "12:00", end: "19:00" },
 *           { day: "thursday", start: "11:00", end: "19:00" },
 *           { day: "friday", start: "11:00", end: "19:00" },
 *           { day: "saturday", start: "08:00", end: "16:00" },
 *           { day: "sunday", start: "", end: "" }
 *         ]
 *         status: w_pracy
 */

/**
 * @swagger
 * tags:
 *   name: Hairdresser
 *   description: The hairdresser managing API
 */

/**
 * @swagger
 * /api/hairdressers/myAppointments:
 *   get:
 *     summary: Get hairdresser appointments
 *     tags: [Hairdresser]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of appointments
 *       401:
 *         description: Unauthorized
 */
router.get('/myAppointments', authenticate, restrick(['fryzjer']), getHairdresserAppointments);

/**
 * @swagger
 * /api/hairdressers:
 *   get:
 *     summary: Get all hairdressers
 *     tags: [Hairdresser]
 *     responses:
 *       200:
 *         description: List of hairdressers
 */
router.get('/', getAllHairdresser);

/**
 * @swagger
 * /api/hairdressers/{id}:
 *   delete:
 *     summary: Delete a hairdresser
 *     tags: [Hairdresser]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The hairdresser id
 *     responses:
 *       200:
 *         description: Hairdresser deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Hairdresser not found
 */
router.delete('/:id', authenticate, restrick(['fryzjer']), deleteHairdresser);

/**
 * @swagger
 * /api/hairdressers/profile/{id}:
 *   get:
 *     summary: Get hairdresser profile
 *     tags: [Hairdresser]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The hairdresser id
 *     responses:
 *       200:
 *         description: Hairdresser profile
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Hairdresser not found
 */
router.get('/profile/:id', authenticate, restrick(['fryzjer']), getHairdresserProfile);

/**
 * @swagger
 * /api/hairdressers/{id}/timeSlots:
 *   get:
 *     summary: Get hairdresser time slots
 *     tags: [Hairdresser]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The hairdresser id
 *     responses:
 *       200:
 *         description: List of time slots
 *       404:
 *         description: Hairdresser not found
 */
router.get('/:id/timeSlots', getHairdresserTimeSlots);

export default router;
