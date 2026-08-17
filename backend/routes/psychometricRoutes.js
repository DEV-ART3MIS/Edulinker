import express from 'express';
import { getQuestions, submitTest, getHistory } from '../controllers/psychometricController.js';

const router = express.Router();

router.get('/questions', getQuestions);
router.post('/submit', submitTest);
router.get('/history', getHistory);

export default router;
