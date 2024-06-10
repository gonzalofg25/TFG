import React, { useState } from 'react';
import axios from 'axios';

const AdminPage = () => {
  const [openModal, setOpenModal] = useState(null);
  const [emailToDelete, setEmailToDelete] = useState('');
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [showButtons, setShowButtons] = useState(false);

  const token = localStorage.getItem('token');

  const toggleModal = async (modal) => {
    if (openModal === modal) {
      setOpenModal(null);
      if (modal === 'delete') {
        setEmailToDelete('');
      }
    } else {
      if (modal === 'users') {
        try {
          const response = await axios.get('https://tfg-ndno.onrender.com/api/user/listadmin', {
            headers: {
              Authorization: `${token}`
            }
          });
          setUsers(response.data);
        } catch (error) {
          console.error('Error al obtener usuarios:', error);
        }
      } else if (modal === 'reviews') {
        try {
          const response = await axios.get('https://tfg-ndno.onrender.com/api/review/admin', {
            headers: {
              Authorization: `${token}`
            }
          });
          setReviews(response.data);
        } catch (error) {
          console.error('Error al obtener valoraciones:', error);
        }
      }
      setOpenModal(modal);
      if (modal !== 'delete') {
        setEmailToDelete('');
      }
    }
  };

  const handleDeleteUser = async (e) => {
    e.preventDefault();
  
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar al usuario?');
  
    if (confirmDelete) {
      try {
        const response = await axios.delete(
          'https://tfg-ndno.onrender.com/api/user/borraradmin',
          {
            headers: {
              Authorization: `${token}`
            },
            data: { email: emailToDelete }
          }
        );
        if (response.status === 200) {
          alert('Usuario eliminado exitosamente');
          setOpenModal(null);
          setEmailToDelete('');
          toggleModal('users');
        }
      } catch (error) {
        if (error.response && error.response.status === 403 && error.response.data.message === "No se puede eliminar un usuario con rol de administrador") {
          alert('No se puede eliminar un usuario con rol de administrador');
        } else if (error.response && error.response.status === 404) {
          alert('El usuario no se encuentra en la base de datos');
        } else {
          console.error('Error al eliminar usuario:', error);
          alert('Ha ocurrido un error. Por favor, inténtalo nuevamente más tarde.');
        }
      }
    }
  };
  

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const handleHamburgerClick = () => {
    setShowButtons(!showButtons); // Cambia el estado para mostrar/ocultar los botones
  };

  return (
    <div id='admin'>
      <div id='admin-container'>
        <h2 id='admin-tit'>Panel de Administrador</h2>
        <nav className="horizontal-menu">
          <button onClick={() => toggleModal('users')}>
            {openModal === 'users' ? 'Ocultar Usuarios' : 'Ver Usuarios'}
          </button>
          <button onClick={() => toggleModal('delete')}>
            {openModal === 'delete' ? 'Ocultar Eliminar Usuario' : 'Eliminar Usuario'}
          </button>
          <button onClick={() => toggleModal('reviews')}>
            {openModal === 'reviews' ? 'Ocultar Valoraciones' : 'Ver Valoraciones'}
          </button>
          <button id='cerrarsesion' onClick={handleLogout}>Cerrar Sesión</button>
        </nav>

        <div className="hamburger-menu" onClick={handleHamburgerClick}>
          <div className="hamburger-menu-icon">
            ☰
          </div>
        </div>

        {/* Botones que se mostrarán al hacer clic en el menú hamburguesa */}
        {showButtons && (
          <div className="buttons">
            <button onClick={() => toggleModal('users')}>
              {openModal === 'users' ? 'Ocultar Usuarios' : 'Ver Usuarios'}
            </button>
            <button onClick={() => toggleModal('delete')}>
              {openModal === 'delete' ? 'Ocultar Eliminar Usuario' : 'Eliminar Usuario'}
            </button>
            <button onClick={() => toggleModal('reviews')}>
              {openModal === 'reviews' ? 'Ocultar Valoraciones' : 'Ver Valoraciones'}
            </button>
            <button id='cerrarsesion-hamburguer' onClick={handleLogout}>Cerrar Sesión</button>
          </div>
        )}



        {openModal === 'users' && (
          <div className="admin">
            <div className={`admin-content ${openModal === 'users' ? 'fade-in' : ''}`}>
              <h3>Lista de Usuarios</h3>
              <table id='tabla-usuarios'>
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Rol</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={index}>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td>{user.roles.join(', ')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {openModal === 'delete' && (
          <div className="admin">
            <div className={`admin-content ${openModal === 'delete' ? 'fade-in' : ''}`}>
              <h3>Eliminar Usuario</h3>
              <form id='eliminar-admin' onSubmit={handleDeleteUser}>
                <div>
                  <label>Email del Usuario a Eliminar:</label>
                  <input type="email" value={emailToDelete} onChange={(e) => setEmailToDelete(e.target.value)} />
                </div>
                <button type="submit">Eliminar</button>
              </form>
            </div>
          </div>
        )}

        {openModal === 'reviews' && (
          <div className="admin">
            <div className={`admin-content ${openModal === 'reviews' ? 'fade-in' : ''}`}>
              <h3>Lista de Valoraciones</h3>
              <table id='tabla-reviews'>
                <thead>
                  <tr>
                    <th>Usuario</th>
                    <th>Barbero</th>
                    <th>Calificación</th>
                    <th>Comentario</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((review, index) => (
                    <tr key={index}>
                      <td>{review.user.username}</td>
                      <td>{review.barber.username}</td>
                      <td>{review.rating}</td>
                      <td>{review.comment}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
