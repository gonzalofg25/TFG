import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Modal from 'react-modal';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

Modal.setAppElement('#root');

const ClientePage = () => {
  const { username } = useParams();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [showForm, setShowForm] = useState(false);
  const [currentUserData] = useState({});
  const [barberos, setBarberos] = useState([]);
  const [showBarberos, setShowBarberos] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [barberName, setBarberName] = useState('');
  const [date, setDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [token] = useState(localStorage.getItem('token'));
  const [availableTimes, setAvailableTimes] = useState([]);

  useEffect(() => {
    const fetchBarbers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/user/barbers', {
          headers: {
            Authorization: `${token}`
          }
        });
        setBarberos(response.data);
      } catch (error) {
        console.error('Error al obtener barberos:', error);
      }
    };
    fetchBarbers();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const handleShowBarbers = async () => {
    try {
      if (showBarberos) {
        setShowBarberos(false);
      } else {
        setShowBarberos(true);
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error al obtener barberos:', error);
    }
  };

  const handleUpdateUserInfo = async (e) => {
    e.preventDefault();
    try {
      const { username, email, password } = formData;
      const data = {
        username: username || currentUserData.username,
        email: email || currentUserData.email,
        password
      };

      await axios.put(
        'http://localhost:3000/api/user/modificar',
        data,
        {
          headers: {
            Authorization: `${token}`
          }
        }
      );

      setFormData({
        username: '',
        email: '',
        password: ''
      });

      localStorage.removeItem('token');

      alert('¡Información actualizada correctamente!');
      window.location.href = '/login';
    } catch (error) {
      console.error('Error al actualizar la información del usuario:', error);
      if (error.response && error.response.status === 401) {
        alert('No estás autorizado para realizar esta acción. Por favor, inicia sesión nuevamente.');
      } else {
        alert('Ha ocurrido un error. Por favor, intenta nuevamente más tarde.');
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitAppointment = async (e) => {
    e.preventDefault();
    try {
      if (!barberName || !selectedTime || !title || !description) {
        alert('Por favor, completa todos los campos.');
        return;
      }

      // Concatenar la fecha seleccionada con la hora seleccionada
      const selectedDateTimeString = `${date.toISOString().slice(0, 10)}T${selectedTime}`;
      // Crear un nuevo objeto Date con la fecha y hora concatenadas
      const selectedDateTime = new Date(selectedDateTimeString);

      // Ajustar la fecha y hora de la cita para evitar el problema
      selectedDateTime.setDate(selectedDateTime.getDate() + 1); // Sumar un día
      selectedDateTime.setHours(selectedDateTime.getHours() + 2); // Sumar dos horas

      const appointmentData = {
        barberName: barberName,
        title: title,
        date: selectedDateTime.toISOString(), // Convertir la fecha y hora a formato ISO string
        description: description
      };

      await axios.post('http://localhost:3000/api/appoint/cita', appointmentData, {
        headers: {
          Authorization: `${token}`
        }
      });
      alert('Cita programada exitosamente');
      setModalIsOpen(false);
    } catch (error) {
      console.error('Error al programar la cita:', error);
      alert('Ha ocurrido un error al programar la cita. Por favor, intenta nuevamente más tarde.');
    }
  };

  const handleSelectBarber = async (barber) => {
    setBarberName(barber.username);
    const availableTimes = getAvailableTimes(date, barber.username);
    setAvailableTimes(availableTimes);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const isWeekday = (date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6; // No es domingo ni sábado
  };

  const isFutureDate = (date) => {
    const today = new Date();
    return date >= today; // Es una fecha futura o del mismo día
  };

  const getAvailableTimes = (date, barberName) => {
    const dayOfWeek = date.getDay();
    const availableTimes = [];

    // Verificar si es domingo (0) o sábado (6)
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      // No hay horarios disponibles los domingos ni sábados
      return availableTimes;
    }

    // Añadir horarios disponibles de 09:00 a 13:00 y de 16:00 a 21:00
    for (let hour = 9; hour <= 21; hour++) {
      if (hour < 13 || (hour >= 16 && hour <= 21)) {
        availableTimes.push(`${hour}:00`);
      }
    }

    return availableTimes;
  };

  const handleDateChange = async (date) => {
    setDate(date);
    if (barberName && isWeekday(date) && isFutureDate(date)) {
      const availableTimes = getAvailableTimes(date, barberName);
      setAvailableTimes(availableTimes);
    } else {
      setAvailableTimes([]);
    }
  };

  return (
    <div>
      <h2>Bienvenido, {username}!</h2>
      <p>Esta es la página para usuarios con rol "cliente". Aquí puedes mostrar información específica del usuario.</p>
      
      <button onClick={() => setShowForm(!showForm)}>Actualizar información</button>
      
      {showForm && (
        <form onSubmit={handleUpdateUserInfo}>
          <div>
            <label>Nombre de usuario:</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} />
          </div>
          <div>
            <label>Email:</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} />
          </div>
          <div>
            <label>Contraseña:</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} />
          </div>
          <button type="submit">Actualizar información</button>
        </form>
      )}

      <button onClick={handleShowBarbers}>Mostrar Barberos</button>

      {showBarberos && (
        <div>
          <h3>Barberos:</h3>
          <ul>
            {barberos.map((barbero, index) => (
              <li key={index} onClick={() => handleSelectBarber(barbero)}>{barbero.username} - {barbero.email}</li>
            ))}
          </ul>
        </div>
      )}

      <button onClick={() => setModalIsOpen(true)}>Seleccionar cita</button>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Seleccionar cita"
      >
        <h2>Seleccionar cita</h2>
        <form onSubmit={handleSubmitAppointment}>
          <div>
            <label>Barbero:</label>
            <select value={barberName} onChange={(e) => setBarberName(e.target.value)}>
              <option value="">Seleccionar barbero</option>
              {barberos.map((barbero, index) => (
                <option key={index} value={barbero.username}>{barbero.username}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Fecha:</label>
            <Calendar value={date} onChange={handleDateChange} tileDisabled={({ date }) => !isWeekday(date) || !isFutureDate(date)} />
          </div>
          {availableTimes.length > 0 ? (
            <div>
              <label>Horarios disponibles:</label>
              <ul>
                {availableTimes.map((time, index) => (
                  <li key={index} onClick={() => handleTimeSelect(time)}>
                    <button>{time}</button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p>No hay horarios disponibles para este barbero en esta fecha.</p>
          )}
          <div>
            <label>Título:</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <label>Descripción:</label>
            <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <button type="submit">Programar cita</button>
        </form>
      </Modal>

      <button onClick={handleLogout}>Cerrar Sesión</button>
    </div>
  );
};

export default ClientePage;
