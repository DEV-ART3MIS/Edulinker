import express from 'express';
import {
  getStudentDashboard,
  getParentDashboard,
  linkParentAccount,
  getTeacherDashboard,
  sendTeacherNotification,
  getAdminDashboardData,
  enrollStudentTutor,
  unenrollStudentTutor
} from '../controllers/dashboardController.js';

const router = express.Router();

// Student Dashboard & Enrollment / De-enrollment
router.get('/student', getStudentDashboard);
router.post('/enroll', enrollStudentTutor);
router.post('/unenroll', unenrollStudentTutor);

// Parent Dashboard & Link PAR-CODE
router.get('/parent', getParentDashboard);
router.post('/parent/link', linkParentAccount);

// Teacher Dashboard & Notifications
router.get('/teacher', getTeacherDashboard);
router.post('/teacher/notify', sendTeacherNotification);

// Admin Dashboard
router.get('/admin', getAdminDashboardData);

export default router;
