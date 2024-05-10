import React, { useState } from 'react';
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
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    // Limpiar el token de sesión y redirigir a la página de inicio
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const handleShowBarbers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/user/barbers', {
        headers: {
          Authorization: `${token}`
        }
      });
      console.log('Barberos:', response.data);
      // Aquí puedes manejar la respuesta y mostrar la información de los barberos en tu aplicación
    } catch (error) {
      console.error('Error al obtener barberos:', error);
    }
  };

  const handleUpdateUserInfo = async (e) => {
    e.preventDefault(); // Evitar que la página se recargue al enviar el formulario
    try {
      const { username, email, password } = formData;
      const data = { username, email, password };
  
      await axios.post(
        'http://localhost:3000/api/user/modificar',
        data,
        {
          headers: {
            Authorization: `${token}`
          }
        }
      );
  
      // Mostrar mensaje de éxito
      alert('¡Información actualizada correctamente!');
      // Limpiar el formulario después de la actualización
      setFormData({
        username: '',
        email: '',
        password: ''
      });
    } catch (error) {
      console.error('Error al actualizar la información del usuario:', error);
      if (error.response && error.response.status === 401) {
        // Mostrar mensaje de error específico para el caso de no autorizado
        alert('No estás autorizado para realizar esta acción. Por favor, inicia sesión nuevamente.');
      } else {
        // Mostrar un mensaje genérico para otros errores
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
      
      {/* Botón para mostrar el formulario de actualización */}
      <button onClick={() => setShowForm(true)}>Actualizar información</button>
      
      {/* Formulario para actualizar información del usuario */}
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

      {/* Botones adicionales */}
      <button onClick={handleLogout}>Cerrar Sesión</button>
      <button onClick={handleShowBarbers}>Mostrar Barberos</button>
    </div>
  );
};

export default ClientePage;
