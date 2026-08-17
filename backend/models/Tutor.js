import mongoose from 'mongoose';

const tutorSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  title: { type: String, required: true },
  avatar: { type: String, required: true },
  location: { type: String, required: true },
  mode: { type: String, required: true },
  hourlyRate: { type: Number, required: true },
  rating: { type: Number, default: 4.8 },
  totalReviews: { type: Number, default: 12 },
  subjects: [{ type: String }],
  classes: [{ type: String }],
  boards: [{ type: String }],
  isVerified: { type: Boolean, default: false },
  degreeVerified: { type: Boolean, default: false },
  kycStatus: { type: String, enum: ['APPROVED', 'PENDING_VERIFICATION', 'REJECTED'], default: 'PENDING_VERIFICATION' },
  bio: { type: String, required: true },
  qualification: { type: String, required: true },
  experienceYears: { type: Number, default: 5 }
}, { timestamps: true });

export const Tutor = mongoose.models.Tutor || mongoose.model('Tutor', tutorSchema);
