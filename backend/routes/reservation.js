import express from 'express';
import { authenticate, restrick } from '../auth/verifyToken.js';
import { createReservation, getReservations, getReservationsByHairdresserAndDate, deleteReservation, updateReservation } from '../controllers/reservationController.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Booking:
 *       type: object
 *       required:
 *         - hairdresser
 *         - user
 *         - services
 *         - time
 *         - appointmentDate
 *         - userName
 *         - userEmail
 *         - userPhone
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the booking
 *         hairdresser:
 *           type: string
 *           description: The id of the hairdresser
 *         user:
 *           type: string
 *           description: The id of the user
 *         services:
 *           type: array
 *           items:
 *             type: string
 *           description: The ids of the services
 *         time:
 *           type: string
 *           description: The time of the appointment
 *         appointmentDate:
 *           type: string
 *           format: date
 *           description: The date of the appointment
 *         userName:
 *           type: string
 *           description: The name of the user
 *         userEmail:
 *           type: string
 *           description: The email of the user
 *         userPhone:
 *           type: string
 *           description: The phone number of the user
 *         reminderSent:
 *           type: boolean
 *           description: Whether a reminder has been sent
 *       example:
 *         id: d5fE_asz
 *         hairdresser: 60d0fe4f5311236168a109ca
 *         user: 60d0fe4f5311236168a109cb
 *         services: [60d0fe4f5311236168a109cc]
 *         time: "10:00"
 *         appointmentDate: "2023-12-23"
 *         userName: John Doe
 *         userEmail: john.doe@example.com
 *         userPhone: "123456789"
 *         reminderSent: false
 */

/**
 * @swagger
 * tags:
 *   name: Reservation
 *   description: The reservation managing API
 */

/**
 * @swagger
 * /api/reservations:
 *   post:
 *     summary: Create a new reservation
 *     tags: [Reservation]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Booking'
 *     responses:
 *       201:
 *         description: Reservation created successfully
 *       500:
 *         description: Error creating reservation
 */
router.post('/', authenticate, restrick(['klient']), createReservation);

/**
 * @swagger
 * /api/reservations:
 *   get:
 *     summary: Get all reservations
 *     tags: [Reservation]
 *     responses:
 *       200:
 *         description: List of reservations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Booking'
 *       500:
 *         description: Error retrieving reservations
 */
router.get('/', getReservations);

/**
 * @swagger
 * /api/reservations/{hairdresserId}/{date}:
 *   get:
 *     summary: Get reservations by hairdresser and date
 *     tags: [Reservation]
 *     parameters:
 *       - in: path
 *         name: hairdresserId
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the hairdresser
 *       - in: path
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: The date of the reservations
 *     responses:
 *       200:
 *         description: List of reservations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Booking'
 *       500:
 *         description: Error retrieving reservations
 */
router.get('/:hairdresserId/:date', getReservationsByHairdresserAndDate);

/**
 * @swagger
 * /api/reservations/bookings/{id}:
 *   put:
 *     summary: Update a reservation
 *     tags: [Reservation]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the reservation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Booking'
 *     responses:
 *       200:
 *         description: Reservation updated successfully
 *       500:
 *         description: Error updating reservation
 */
router.put('/bookings/:id', authenticate, updateReservation);

/**
 * @swagger
 * /api/reservations/bookings/{id}:
 *   delete:
 *     summary: Delete a reservation
 *     tags: [Reservation]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the reservation
 *     responses:
 *       200:
 *         description: Reservation deleted successfully
 *       500:
 *         description: Error deleting reservation
 */
router.delete('/bookings/:id', authenticate, restrick(['klient', 'fryzjer']), deleteReservation);

export default router;