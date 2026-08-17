import express from 'express';
import { syncUsers, getAllUsers } from '../controllers/userController.js';

const router = express.Router();

// Route to sync single or batch Clerk registered users to Neon PostgreSQL DB
router.post('/sync', syncUsers);

// Route to get all registered users from Neon PostgreSQL DB
router.get('/', getAllUsers);

export default router;
