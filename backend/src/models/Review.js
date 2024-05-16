import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const reviewSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  barber: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  comment: { type: String },
});

export default model('Review', reviewSchema);
