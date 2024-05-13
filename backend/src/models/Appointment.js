import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const appointmentSchema = new Schema({
  client: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  barber: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true,
    format: '%Y-%m-%dT%H:%M'
  },
  description: {
    type: String
  }
});

export default model('Appointment', appointmentSchema);
