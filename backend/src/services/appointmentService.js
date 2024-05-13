import Appointment from '../models/Appointment.js';

export const appointmentService = {
  createAppointment,
  getBarberAppointments,
};

export async function createAppointment(title, description, barberId, clientId, date) {
  try {
    const appointment = new Appointment({
      title,
      description,
      barber: barberId,
      client: clientId,
      date,
    });
    await appointment.save();
    return appointment;
  } catch (error) {
    throw error;
  }
}

export async function getBarberAppointments(barberId) {
  try {
    const appointments = await Appointment.find({ barber: barberId }).populate('client');
    return appointments;
  } catch (error) {
    throw error;
  }
}

