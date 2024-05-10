import React, { useState } from 'react';
import axios from 'axios';

const AdminPage = () => {
  const [showUserModal, setShowUserModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [emailToDelete, setEmailToDelete] = useState('');
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem('token');

  const handleShowUserModal = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/user/listadmin', {
        headers: {
          Authorization: `${token}`
        }
      });
      setUsers(response.data);
      setShowUserModal(true);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    }
  };

  const handleShowDeleteModal = () => {
    setShowDeleteModal(true);
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
      } else {
        alert('El usuario no se encuentra en la base de datos');
      }
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      alert('Ha ocurrido un error. Por favor, inténtalo nuevamente más tarde.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <div>
      <h2>Panel de Administrador</h2>
      <button onClick={handleShowUserModal}>Ver Usuarios</button>
      <button onClick={handleShowDeleteModal}>Eliminar Usuario</button>
      <button onClick={handleLogout}>Cerrar Sesión</button>

      {showUserModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowUserModal(false)}>&times;</span>
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
            <span className="close" onClick={() => setShowDeleteModal(false)}>&times;</span>
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
    </div>
  );
};

export default AdminPage;
