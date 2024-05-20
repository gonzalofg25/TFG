import React, { useState } from 'react';
import axios from 'axios';

const AdminPage = () => {
  const [showUserModal, setShowUserModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [emailToDelete, setEmailToDelete] = useState('');
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const token = localStorage.getItem('token');

  const toggleShowUserModal = async () => {
    if (!showUserModal) {
      try {
        const response = await axios.get('http://localhost:3000/api/user/listadmin', {
          headers: {
            Authorization: `${token}`
          }
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Error al obtener usuarios:', error);
      }
    }
    setShowUserModal(!showUserModal);
  };

  const toggleShowDeleteModal = () => {
    setShowDeleteModal(!showDeleteModal);
  };

  const handleDeleteUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.delete(
        'http://localhost:3000/api/user/borraradmin',
        {
          headers: {
            Authorization: `${token}`
          },
          data: { email: emailToDelete }
        }
      );
      if (response.status === 200) {
        alert('Usuario eliminado exitosamente');
        setShowDeleteModal(false);
        // Opcional: refrescar la lista de usuarios
        toggleShowUserModal();
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
  };

  const toggleShowReviewsModal = async () => {
    if (!showReviewsModal) {
      try {
        const response = await axios.get('http://localhost:3000/api/review/admin', {
          headers: {
            Authorization: `${token}`
          }
        });
        setReviews(response.data);
      } catch (error) {
        console.error('Error al obtener valoraciones:', error);
      }
    }
    setShowReviewsModal(!showReviewsModal);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <div>
      <h2>Panel de Administrador</h2>
      <button onClick={toggleShowUserModal}>
        {showUserModal ? 'Ocultar Usuarios' : 'Ver Usuarios'}
      </button>
      <button onClick={toggleShowDeleteModal}>
        {showDeleteModal ? 'Ocultar Eliminar Usuario' : 'Eliminar Usuario'}
      </button>
      <button onClick={toggleShowReviewsModal}>
        {showReviewsModal ? 'Ocultar Valoraciones' : 'Ver Valoraciones'}
      </button>
      <button onClick={handleLogout}>Cerrar Sesión</button>

      {showUserModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Lista de Usuarios</h3>
            <table>
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

      {showDeleteModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Eliminar Usuario</h3>
            <form onSubmit={handleDeleteUser}>
              <div>
                <label>Email del Usuario a Eliminar:</label>
                <input type="email" value={emailToDelete} onChange={(e) => setEmailToDelete(e.target.value)} />
              </div>
              <button type="submit">Eliminar</button>
            </form>
          </div>
        </div>
      )}

      {showReviewsModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Lista de Valoraciones</h3>
            <table>
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
  );
};

export default AdminPage;
