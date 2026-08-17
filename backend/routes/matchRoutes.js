import express from 'express';
import { calculateMatches } from '../controllers/matchController.js';

const router = express.Router();

router.post('/', calculateMatches);

export default router;
