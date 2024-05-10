import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
  rating: { type: Number, required: true },
  comment: { type: String },
});

export default mongoose.model('Review', reviewSchema);