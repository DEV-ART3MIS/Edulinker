import express from 'express';
import { getAdminStats, approveKycStatus } from '../controllers/adminController.js';

const router = express.Router();

router.get('/stats', getAdminStats);
router.patch('/kyc/:id', approveKycStatus);

export default router;
