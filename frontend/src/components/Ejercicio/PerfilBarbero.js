import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const BarberoPage = () => {
  const { username } = useParams();
  const [token] = useState(localStorage.getItem('token'));
  const [clientes, setClientes] = useState([]);
  const [error, setError] = useState(null);
  const [citas, setCitas] = useState([]);
  const [showClientes, setShowClientes] = useState(false);
  const [showCitas, setShowCitas] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [showReviews, setShowReviews] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [updateError, setUpdateError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(null);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/user/clientes', {
          headers: {
            Authorization: `${token}`
          }
        });
        setClientes(response.data);
      } catch (error) {
        setError('Error al obtener clientes. Por favor, intenta nuevamente más tarde.');
      }
    };

    const fetchCitas = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/appoint/citasbarbero', {
          headers: {
            Authorization: `${token}`
          }
        });
        setCitas(response.data.citasBarbero);
      } catch (error) {
        setError('Error al obtener citas del barbero. Por favor, intenta nuevamente más tarde.');
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/review/barber/reviews', {
          headers: {
            Authorization: `${token}`
          }
        });
        setReviews(response.data);
      } catch (error) {
        setError('Error al obtener valoraciones. Por favor, intenta nuevamente más tarde.');
      }
    };

    fetchClientes();
    fetchCitas();
    fetchReviews();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    try {
      if (!newUsername.trim() && !newEmail.trim() && !newPassword.trim()) {
        setUpdateError('Por favor, completa al menos uno de los campos para actualizar.');
        return;
      }

      const data = {};
      if (newUsername.trim()) data.username = newUsername;
      if (newEmail.trim()) data.email = newEmail;
      if (newPassword.trim()) data.password = newPassword;

      const response = await axios.put('http://localhost:3000/api/user/modificar', data, {
        headers: {
          Authorization: `${token}`
        }
      });

      if (response.status === 200) {
        const newToken = response.data.token;
        localStorage.setItem('token', newToken);
        setUpdateSuccess('Información actualizada con éxito.');
        setUpdateError(null);
        alert("Información actualizada con éxito.");
        handleLogout();
      } else {
        setUpdateError('Error al actualizar la información. Por favor, intenta nuevamente más tarde.');
        setUpdateSuccess(null);
      }
    } catch (error) {
      setUpdateError('Error al actualizar la información. Por favor, intenta nuevamente más tarde.');
      setUpdateSuccess(null);
    }
  };

  return (
    <div>
      <h2>Bienvenido, {username}!</h2>
      <p>Esta es la página para usuarios con rol "barbero".</p>
      {error && <p>{error}</p>}
      <button onClick={() => setShowClientes(!showClientes)}>
        {showClientes ? 'Ocultar clientes' : 'Obtener clientes'}
      </button>
      <button onClick={() => setShowCitas(!showCitas)}>
        {showCitas ? 'Ocultar Citas' : 'Ver Citas'}
      </button>
      <button onClick={() => setShowReviews(!showReviews)}>
        {showReviews ? 'Ocultar Valoraciones' : 'Ver Valoraciones'}
      </button>
      <button onClick={handleLogout}>Cerrar Sesión</button>
      <button onClick={() => setShowUpdateForm(!showUpdateForm)}>Actualizar Información</button>

{showUpdateForm && (
  <form onSubmit={handleUpdateInfo}>
    <div>
      <label htmlFor="newUsername">Nuevo Nombre de Usuario:</label>
      <input
        type="text"
        id="newUsername"
        value={newUsername}
        onChange={(e) => setNewUsername(e.target.value)}
      />
    </div>
    <div>
      <label htmlFor="newEmail">Nuevo Email:</label>
      <input
        type="email"
        id="newEmail"
        value={newEmail}
        onChange={(e) => setNewEmail(e.target.value)}
      />
    </div>
    <div>
      <label htmlFor="newPassword">Nueva Contraseña:</label>
      <input
        type="password"
        id="newPassword"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
    </div>
    <button type="submit">Actualizar</button>
  </form>
)}
{updateSuccess && <p>{updateSuccess}</p>}
{updateError && <p>{updateError}</p>}
{showClientes && (
  <div>
    <h3>Clientes:</h3>
    <ul>
      {clientes.map((cliente, index) => (
        <li key={index}>{cliente.username} - {cliente.email}</li>
      ))}
    </ul>
  </div>
)}
{showCitas && (
  <div>
    <h3>Citas:</h3>
    <ul>
      {citas.map((cita, index) => (
        <li key={index}>
          <p>Título: {cita.title}</p>
          <p>Fecha: {new Date(cita.date).toLocaleString()}</p>
          <p>Descripción: {cita.description}</p>
        </li>
      ))}
    </ul>
  </div>
)}
{showReviews && (
  <div>
    <h3>Valoraciones:</h3>
    <ul>
      {reviews.map((review, index) => (
        <li key={index}>
          <p>Cliente: {review.cliente}</p>
          <p>Calificación: {review.rating}</p>
          <p>Comentario: {review.comment}</p>
        </li>
      ))}
    </ul>
  </div>
)}
</div>
);
};

export default BarberoPage;