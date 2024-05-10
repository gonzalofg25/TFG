import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ClientePage = () => {
  const { username } = useParams();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [showForm, setShowForm] = useState(false);
  const [currentUserData, setCurrentUserData] = useState({});
  const [barberos, setBarberos] = useState([]);
  const [showBarberos, setShowBarberos] = useState(false); // Estado para mostrar la lista de barberos
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/user', {
          headers: {
            Authorization: `${token}`
          }
        });
        setCurrentUserData(response.data);
      } catch (error) {
        console.error('Error al obtener datos del usuario:', error);
      }
    };

    fetchUserData();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const handleShowBarbers = async () => {
    try {
      if (showBarberos) {
        setShowBarberos(false); // Ocultar la lista de barberos si ya está visible
      } else {
        const response = await axios.get('http://localhost:3000/api/user/barbers', {
          headers: {
            Authorization: `${token}`
          }
        });
        setBarberos(response.data);
        setShowBarberos(true); // Mostrar la lista de barberos
        setShowForm(false); // Ocultar el formulario al mostrar los barberos
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
              <li key={index}>{barbero.username} - {barbero.email}</li>
            ))}
          </ul>
        </div>
      )}

      <button onClick={handleLogout}>Cerrar Sesión</button>
    </div>
  );
};

export default ClientePage;
