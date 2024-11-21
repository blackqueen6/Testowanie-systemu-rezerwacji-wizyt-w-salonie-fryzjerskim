import express from 'express';
import { login, register, resetPassword, verifyResetCode, updatePassword } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/reset-password', resetPassword);
router.post('/verify-reset-code', verifyResetCode);
router.put('/reset-password', updatePassword);

export default router;
