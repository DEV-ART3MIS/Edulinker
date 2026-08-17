import express from 'express';
import { createDemoRequest, getDemoRequests } from '../controllers/demoController.js';

const router = express.Router();

router.post('/', createDemoRequest);
router.get('/', getDemoRequests);

export default router;
