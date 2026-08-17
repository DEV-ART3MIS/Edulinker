import mongoose from 'mongoose';

const demoRequestSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  parentName: { type: String, required: true },
  studentGrade: { type: String, required: true },
  subject: { type: String, required: true },
  tutorId: { type: String, required: true },
  tutorName: { type: String, required: true },
  requestedTime: { type: String, required: true },
  mode: { type: String, required: true },
  status: { type: String, enum: ['CONFIRMED', 'PENDING_TUTOR_ACCEPT', 'COMPLETED'], default: 'CONFIRMED' }
}, { timestamps: true });

export const DemoRequest = mongoose.models.DemoRequest || mongoose.model('DemoRequest', demoRequestSchema);
