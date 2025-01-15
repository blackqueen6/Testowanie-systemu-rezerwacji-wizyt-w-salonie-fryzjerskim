import express from 'express';
import { deleteUser, getUserProfile, getMyAppointments } from '../controllers/userController.js';
import { authenticate, restrick } from '../auth/verifyToken.js';

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
 *           description: The role of the user
 *         gender:
 *           type: string
 *           description: The gender of the user
 *       example:
 *         id: d5fE_asz
 *         email: john.doe@example.com
 *         password: secret
 *         name: John
 *         lastName: Doe
 *         phone: 123456789
 *         role: klient
 *         gender: mężczyzna
 */

/**
 * @swagger
 * tags:
 *   name: User
 *   description: The user managing API
 */

/**
 * @swagger
 * /api/users/profile/{id}:
 *   get:
 *     summary: Get user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     responses:
 *       200:
 *         description: User profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.get('/profile/:id', authenticate, restrick(['klient']), getUserProfile);

/**
 * @swagger
 * /api/users/myAppointments:
 *   get:
 *     summary: Get user appointments
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of appointments
 *       401:
 *         description: Unauthorized
 */
router.get('/myAppointments', authenticate, restrick(['klient']), getMyAppointments);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     responses:
 *       200:
 *         description: User deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.delete('/:id', authenticate, restrick(['klient', 'fryzjer']), deleteUser);

export default router;