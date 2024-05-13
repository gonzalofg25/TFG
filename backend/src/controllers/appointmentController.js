import Appointment from '../models/Appointment.js';
import User from '../models/User.js';

export async function seleccionarCitaConBarbero(req, res) {
  try {
    const { barberName, title, date, description } = req.body;
    const clientId = req.user.id;

    console.log("Datos recibidos:", req.body);

    if (!barberName || !title || !date || !description) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    console.log("Buscando barbero con usuario:", barberName);

    const barber = await User.findOne({ username: barberName });

    if (!barber || barber.roles.indexOf("barbero") === -1) {
      console.log("Barbero encontrado:", barber);
      console.log("Barbero no válido:", barber);
      return res.status(400).json({ message: "El usuario seleccionado no es un barbero válido" });
    }

    console.log("Barbero encontrado:", barber);

    const existingAppointment = await Appointment.findOne({ barber: barber._id, date });

    if (existingAppointment) {
      return res.status(400).json({ message: "Ya tienes una cita con este barbero a la misma hora" });
    }

    const appointment = new Appointment({
      client: clientId,
      barber: barber._id,
      title,
      date,
      description
    });

    await appointment.save();

    return res.status(201).json({ message: 'Cita seleccionada con éxito', appointment });
  } catch (error) {
    console.error('Error al seleccionar la cita:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
}

export async function verCitasDelUsuario(req, res) {
  try {
    const userId = req.user.id;

    const citasUsuario = await Appointment.find({ client: userId }).populate('barber', 'username').select('barber date title');

    return res.status(200).json({ citasUsuario });
  } catch (error) {
    console.error('Error al obtener las citas del usuario:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
}

export async function verCitasDelBarbero(req, res) {
  try {
    const barberId = req.user.id;

    const citasBarbero = await Appointment.find({ barber: barberId }).populate('client', 'username').select('client date title');

    return res.status(200).json({ citasBarbero });
  } catch (error) {
    console.error('Error al obtener las citas del barbero:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
}
