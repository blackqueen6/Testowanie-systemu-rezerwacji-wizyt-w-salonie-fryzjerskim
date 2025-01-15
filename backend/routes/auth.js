import express from 'express';
import { login, register, resetPassword, verifyResetCode, updatePassword } from '../controllers/authController.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - name
 *         - lastName
 *         - phone
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *         email:
 *           type: string
 *           description: The email of the user
 *         password:
 *           type: string
 *           description: The password of the user
 *         name:
 *           type: string
 *           description: The name of the user
 *         lastName:
 *           type: string
 *           description: The last name of the user
 *         phone:
 *           type: number
 *           description: The phone number of the user
 *         role:
 *           type: string
 *           enum: [klient, fryzjer]
 *           description: The role of the user
 *         gender:
 *           type: string
 *           enum: [kobieta, mężczyzna]
 *           description: The gender of the user
 *         resetCode:
 *           type: string
 *           description: The reset code for password recovery
 *       example:
 *         id: d5fE_asz
 *         email: john.doe@example.com
 *         password: secret
 *         name: John
 *         lastName: Doe
 *         phone: 123456789
 *         role: klient
 *         gender: mężczyzna
 *         resetCode: 123456
 */

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: The authentication managing API
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: The user was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 */
router.post('/register', register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               email: john.doe@example.com
 *               password: secret
 *     responses:
 *       200:
 *         description: The user was successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       400:
 *         description: Invalid credentials
 */
router.post('/login', login);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset user password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *             example:
 *               email: john.doe@example.com
 *     responses:
 *       200:
 *         description: Password reset email sent
 *       400:
 *         description: Invalid request
 */
router.post('/reset-password', resetPassword);

/**
 * @swagger
 * /api/auth/verify-reset-code:
 *   post:
 *     summary: Verify reset code
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               resetCode:
 *                 type: string
 *             example:
 *               email: john.doe@example.com
 *               resetCode: 123456
 *     responses:
 *       200:
 *         description: Reset code verified
 *       400:
 *         description: Invalid reset code
 */
router.post('/verify-reset-code', verifyResetCode);

/**
 * @swagger
 * /api/auth/reset-password:
 *   put:
 *     summary: Update user password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               newPassword:
 *                 type: string
 *             example:
 *               email: john.doe@example.com
 *               newPassword: newSecret
 *     responses:
 *       200:
 *         description: Password was successfully updated
 *       400:
 *         description: Invalid request
 */
router.put('/reset-password', updatePassword);

export default router;