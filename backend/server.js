import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import tutorRoutes from './routes/tutorRoutes.js';
import matchRoutes from './routes/matchRoutes.js';
import demoRoutes from './routes/demoRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import psychometricRoutes from './routes/psychometricRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { initDatabase } from './config/database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
connectDB();
initDatabase();

// API Routes
app.use('/api/tutors', tutorRoutes);
app.use('/api/match', matchRoutes);
app.use('/api/demos', demoRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/psychometric', psychometricRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/users', userRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'HEALTHY',
    service: 'EduLinker MERN Backend API',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[EduLinker Backend]: Server listening on http://localhost:${PORT}`);
});

