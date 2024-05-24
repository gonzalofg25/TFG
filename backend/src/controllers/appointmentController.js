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
      console.log("Barbero no encontrado o no válido:", barber);
      return res.status(400).json({ message: "El usuario seleccionado no es un barbero válido" });
    }

    console.log("Barbero encontrado:", barber);

    const existingAppointment = await Appointment.findOne({ barber: barber._id, date });

    if (existingAppointment) {
      return res.status(400).json({ message: "Ya hay una cita con este barbero a esa hora" });
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

export async function modificarCita(req, res) {
  try {
    const { citaId } = req.params;
    let { title, date } = req.body;

    console.log("Datos recibidos:", req.body);

    if (!date) {
      return res.status(400).json({ message: "Falta el campo de fecha" });
    }

    const cita = await Appointment.findById(citaId);

    if (!cita) {
      return res.status(404).json({ message: "La cita no existe" });
    }

    const otraCita = await Appointment.findOne({ barberName: cita.barberName, date: date });

    if (otraCita && otraCita._id.toString() !== citaId) {
      return res.status(400).json({ message: "Ya existe una cita para este barbero en la misma fecha y hora" });
    }

    if (!title) {
      title = cita.title;
    }

    cita.title = title;
    cita.date = date;

    await cita.save();

    return res.status(200).json({ message: 'Cita modificada con éxito', cita });
  } catch (error) {
    console.error('Error al modificar la cita:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
}


export async function cancelarCita(req, res) {
  try {
    const { citaId } = req.params;
    const clientId = req.user.id;

    const cita = await Appointment.findById(citaId);

    if (!cita) {
      return res.status(404).json({ message: "La cita no existe" });
    }

    if (cita.client.toString() !== clientId) {
      return res.status(403).json({ message: "No tienes permiso para cancelar esta cita" });
    }

    await Appointment.findByIdAndDelete(citaId);

    return res.status(200).json({ message: 'Cita cancelada con éxito' });
  } catch (error) {
    console.error('Error al cancelar la cita:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
}

export async function getCitasBarberoEnFecha(req, res) {
  try {
    const { barberName, date } = req.params;

    const barber = await User.findOne({ username: barberName });
    if (!barber) {
      return res.status(404).json({ message: "Barbero no encontrado" });
    }
    const barberId = barber._id;

    const selectedDate = new Date(date);

    selectedDate.setHours(0, 0, 0, 0);

    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    const citasBarbero = await Appointment.find({
      barber: barberId,
      date: { $gte: selectedDate, $lte: endOfDay }
    }).select('date');

    return res.status(200).json({ citasBarbero });
  } catch (error) {
    console.error('Error al obtener las citas del barbero en la fecha especificada:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
}

