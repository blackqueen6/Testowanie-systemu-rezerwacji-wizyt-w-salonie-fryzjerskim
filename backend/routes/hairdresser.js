import express from 'express';
import { deleteHairdresser, getAllHairdresser, getHairdresserProfile, getHairdresserAppointments, } from '../controllers/hairdresserController.js';
import { authenticate, restrick } from '../auth/verifyToken.js';

const router = express.Router();

router.get('/myAppointments', authenticate, restrick(['fryzjer']), getHairdresserAppointments);
router.get('/', getAllHairdresser);
router.delete('/:id', authenticate, restrick(['fryzjer']), deleteHairdresser);
router.get('/profile/:id', authenticate, restrick(['fryzjer']), getHairdresserProfile);



export default router;
