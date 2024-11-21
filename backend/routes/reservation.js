import express from 'express';
import { authenticate, restrick } from '../auth/verifyToken.js';
import { createReservation, getReservations, getReservationsByHairdresserAndDate, deleteReservation, updateReservation } from '../controllers/reservationController.js';

const router = express.Router();

router.post('/', authenticate, restrick(['klient']), createReservation);
router.get('/', getReservations);
router.get('/:hairdresserId/:date', getReservationsByHairdresserAndDate);
router.put('/bookings/:id', authenticate, updateReservation);
router.delete('/bookings/:id', authenticate, restrick(['klient', 'fryzjer']), deleteReservation);

export default router;