import React, { useState } from 'react';
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const handleFetchClientes = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/user/clientes', {
        headers: {
          Authorization: `${token}`
        }
      });
      console.log('Clientes obtenidos:', response.data);
      setClientes(response.data);
      setShowClientes(!showClientes);
      console.log('Clientes visibles:', !showClientes);
    } catch (error) {
      console.error('Error al obtener clientes:', error);
      setError('Error al obtener clientes. Por favor, intenta nuevamente más tarde.');
    }
  };

  const handleViewAppointments = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/appoint/citasbarbero', {
        headers: {
          Authorization: `${token}`
        }
      });
      console.log('Citas obtenidas:', response.data);
      const citasBarbero = response.data.citasBarbero; 
      setCitas(citasBarbero); 
      setShowCitas(!showCitas);
      console.log('Citas visibles:', !showCitas);
    } catch (error) {
      console.error('Error al obtener citas del barbero:', error);
      setError('Error al obtener citas del barbero. Por favor, intenta nuevamente más tarde.');
    }
  };
  

  return (
    <div>
      <h2>Bienvenido, {username}!</h2>
      <p>Esta es la página para usuarios con rol "barbero".</p>
      {error && <p>{error}</p>}
      <button onClick={handleFetchClientes}>
        {showClientes ? 'Ocultar clientes' : 'Obtener clientes'}
      </button>
      <button onClick={handleViewAppointments}>
        {showCitas ? 'Ocultar Citas' : 'Ver Citas'}
      </button>
      <button onClick={handleLogout}>Cerrar Sesión</button>
      {showClientes && clientes.length > 0 && (
        <div>
          <h3>Clientes:</h3>
          <ul>
            {clientes.map((cliente, index) => (
              <li key={index}>{cliente.username} - {cliente.email}</li>
            ))}
          </ul>
        </div>
      )}
      {showCitas && citas.length > 0 && (
        <div>
          <h3>Citas:</h3>
          <ul>
            {citas.map((cita, index) => (
              <li key={index}>
                <p>Cliente: {cita.client.username}</p>
                <p>Título: {cita.title}</p>
                <p>Fecha: {new Date(cita.date).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default BarberoPage;
