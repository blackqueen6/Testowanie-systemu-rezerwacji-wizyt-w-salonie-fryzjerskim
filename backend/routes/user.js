import express from 'express';
import { deleteUser, getUserProfile, getMyAppointments } from '../controllers/userController.js';
import { authenticate, restrick } from '../auth/verifyToken.js';


const router = express.Router();

router.get('/profile/:id', authenticate, restrick(['klient']), getUserProfile);
router.get('/myAppointments', authenticate, restrick(['klient']), getMyAppointments);
router.delete('/:id', authenticate, restrick(['klient', 'fryzjer']), deleteUser);




export default router;

