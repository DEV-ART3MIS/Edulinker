import mongoose from 'mongoose';

const psychometricResultSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  studentName: { type: String, default: 'Student User' },
  grade: { type: String, required: true },
  board: { type: String, required: true },
  subject: { type: String, required: true },
  totalMarks: { type: Number, required: true },
  learningStyle: { type: String, required: true },
  breakdown: {
    analytical: { type: Number, default: 0 },
    conceptual: { type: Number, default: 0 },
    examStrategy: { type: Number, default: 0 },
    problemSolving: { type: Number, default: 0 }
  },
  suggestions: [{ type: String }],
  recommendedTutors: [{
    tutorId: String,
    tutorName: String,
    matchScore: Number,
    fitReason: String
  }]
}, { timestamps: true });

export const PsychometricResult = mongoose.models.PsychometricResult || mongoose.model('PsychometricResult', psychometricResultSchema);
