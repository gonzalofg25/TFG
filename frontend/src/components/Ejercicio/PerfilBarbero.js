import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { useParams } from 'react-router-dom';

const BarberoPage = () => {
  const { username } = useParams();
  const [token] = useState(localStorage.getItem('token'));
  const [clientes, setClientes] = useState([]);
  const [citas, setCitas] = useState([]);
  const [showSection, setShowSection] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [updateError, setUpdateError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(null);
  const [showButtons, setShowButtons] = useState(false);

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
        console.error('Error al obtener clientes. Por favor, intenta nuevamente más tarde.');
      }
    };

    const fetchCitas = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/appoint/citasbarbero', {
          headers: {
            Authorization: `${token}`
          }
        });
        const citasData = response.data.citasBarbero.map(cita => ({
          ...cita,
          date: new Date(cita.date)
        }));
        citasData.forEach(cita => {
          cita.date.setHours(cita.date.getHours() - 2);
        });
        setCitas(citasData);
      } catch (error) {
        console.error('Error al obtener citas del barbero. Por favor, intenta nuevamente más tarde.');
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/review/barber/reviews', {
          headers: {
            Authorization: `${token}`
          }
        });
        console.log(response.data);
        setReviews(response.data);
      } catch (error) {
        console.error('Error al obtener valoraciones. Por favor, intenta nuevamente más tarde.');
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

  const handleShowSection = (section) => {
    if (showSection === section) {
      setShowSection(null);
    } else {
      if (section === 'citas' && citas.length === 0) {
        alert('No tienes ninguna cita reservada.');
        return;
      }
      setShowSection(section);
    }
  };

  const handleDeleteCita = async (citaId) => {
    try {
      const confirmDelete = window.confirm('¿Estás seguro que deseas cancelar la cita?');
  
      if (!confirmDelete) {
        return; 
      }
  
      console.log(`Intentando eliminar cita con ID: ${citaId}`);
      const response = await axios.delete(`http://localhost:3000/api/appoint/citabarbero/${citaId}`, {
        headers: {
          Authorization: `${token}`
        }
      });
  
      console.log('Respuesta del servidor:', response);
      setCitas(citas.filter(cita => cita._id !== citaId));
  
      alert('Cita cancelada exitosamente');
      setShowSection(null);
    } catch (error) {
      console.error('Error al eliminar la cita:', error.response ? error.response.data : error.message);
      alert('Error al eliminar la cita. Por favor, intenta nuevamente más tarde.');
    }
  };
  
  const handleCompleteCita = async (citaId) => {
    try {
      const confirmDelete = window.confirm('¿Estás seguro que deseas marcar como completada la cita?');
  
      if (!confirmDelete) {
        return;
      }
  
      console.log(`Marcar cómo completada la cita con ID: ${citaId}`);
      const response = await axios.delete(`http://localhost:3000/api/appoint/citabarbero/${citaId}`, {
        headers: {
          Authorization: `${token}`
        }
      });
  
      console.log('Respuesta del servidor:', response);
      setCitas(citas.filter(cita => cita._id !== citaId));
  
      alert('Cita completada');
      setShowSection(null);
    } catch (error) {
      console.error('Error al completar la cita:', error.response ? error.response.data : error.message);
      alert('Error al completar la cita. Por favor, intenta nuevamente más tarde.');
    }
  }

  const handleHamburgerClick = () => {
    setShowButtons(!showButtons);
  };
  
  return (
    <div id='barber'>
      <div id='barber-container'>
        <h2 id='barber-tit'>Bienvenido, {username}!</h2>
        <nav className="horizontal-menu">
          <button onClick={() => handleShowSection('clientes')}>
            {showSection === 'clientes' ? 'Ocultar clientes' : 'Obtener clientes'}
          </button>
          <button onClick={() => handleShowSection('citas')}>
            {showSection === 'citas' ? 'Ocultar Citas' : 'Ver Citas'}
          </button>
          <button onClick={() => handleShowSection('reviews')}>
            {showSection === 'reviews' ? 'Ocultar Valoraciones' : 'Ver Valoraciones'}
          </button>
          <button onClick={() => handleShowSection('update')}>
            {showSection === 'update' ? 'Ocultar Actualización' : 'Actualizar Información'}
          </button>
          <button id='cerrarsesion' onClick={handleLogout}>Cerrar Sesión</button>
        </nav>

        <div className="hamburger-menu" onClick={handleHamburgerClick}>
          <div className="hamburger-menu-icon">
            ☰
          </div>
        </div>

        {showButtons && (
          <div className="buttons">
            <button onClick={() => handleShowSection('clientes')}>
              {showSection === 'clientes' ? 'Ocultar clientes' : 'Obtener clientes'}
            </button>
            <button onClick={() => handleShowSection('citas')}>
              {showSection === 'citas' ? 'Ocultar Citas' : 'Ver Citas'}
            </button>
            <button onClick={() => handleShowSection('reviews')}>
              {showSection === 'reviews' ? 'Ocultar Valoraciones' : 'Ver Valoraciones'}
            </button>
            <button onClick={() => handleShowSection('update')}>
              {showSection === 'update' ? 'Ocultar Actualización' : 'Actualizar Información'}
            </button>
            <button id='cerrarsesion-hamburguer' onClick={handleLogout}>Cerrar Sesión</button>
          </div>
        )}

        {showSection === 'update' && (
          <div className='barber'>
            <div className={`barber-content ${showSection === 'update' ? 'fade-in' : ''}`}>
              <h3>Actualizar Usuario</h3>
              <form id='actualizar-barbero' onSubmit={handleUpdateInfo}>
                <div>
                  <label htmlFor="newUsername">Nombre de Usuario</label>
                  <br/>
                  <input
                    type="text"
                    id="newUsername"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="newEmail">Email</label>
                  <br/>
                  <input
                    type="email"
                    id="newEmail"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="newPassword">Contraseña</label>
                  <br/>
                  <input
                    type="password"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <button type="submit">Actualizar</button>
              </form>
            </div>
          </div>
        )}
        {updateSuccess && <p>{updateSuccess}</p>}
        {updateError && <p>{updateError}</p>}
        {showSection === 'clientes' && (
          <div className='barber'>
            <div className={`barber-content ${showSection === 'clientes' ? 'fade-in' : ''}`}>
              <h3>Clientes:</h3>
              <table>
                <thead>
                  <tr>
                    <th>Nombre de Usuario</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {clientes.map((cliente, index) => (
                    <tr key={index}>
                      <td>{cliente.username}</td>
                      <td>{cliente.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {showSection === 'citas' && (
          <div className='barber'>
            <div className={`barber-content ${showSection === 'citas' ? 'fade-in' : ''}`}>
              <h3>Citas:</h3>
              <table>
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Título</th>
                    <th>Fecha</th>
                    <th>Hora</th>
                    <th>Borrar</th>
                    <th>Completada</th>
                  </tr>
                </thead>
                <tbody>
                {citas
                  .sort((a, b) => new Date(a.date) - new Date(b.date) || new Date(a.date) - new Date(b.date))
                  .map((cita, index) => {
                    const citaDate = new Date(cita.date);
                    const formattedDate = citaDate.toLocaleDateString();
                    const formattedTime = citaDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    return (
                      <tr key={index}>
                        <td>{cita.client ? cita.client.username : 'Cliente desconocido'}</td>
                        <td>{cita.title}</td>
                        <td>{formattedDate}</td>
                        <td>{formattedTime}</td>
                        <td>
                          <button onClick={() => handleDeleteCita(cita._id)}><RiDeleteBin6Line /></button>
                        </td>
                        <td>
                          <button onClick={() => handleCompleteCita(cita._id)}>✔️</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {showSection === 'reviews' && (
          <div className='barber'>
            <div className={`barber-content ${showSection === 'reviews' ? 'fade-in' : ''}`}>
              <h3>Valoraciones:</h3>
              <table>
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Calificación</th>
                    <th>Comentario</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((review, index) => {
                    const clientUsername = review.user ? review.user.username : 'Cliente desconocido';
                    return (
                      <tr key={index}>
                        <td>{clientUsername}</td>
                        <td>{review.rating}</td>
                        <td>{review.comment}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BarberoPage;
