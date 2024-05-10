import Appointment from '../models/Appointment.js';

export const appointmentService = {
  createAppointment,
  getBarberAppointments,
  // otras funciones de servicio aquí según sea necesario
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

// Implementa otras funciones de servicio según sea necesario, como confirmar citas, obtener citas de clientes, etc.
