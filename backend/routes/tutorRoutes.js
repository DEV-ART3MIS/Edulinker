import express from 'express';
import { getTutors, getTutorById } from '../controllers/tutorController.js';

const router = express.Router();

router.get('/', getTutors);
router.get('/:id', getTutorById);

export default router;
