import React, { useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(''); // Limpiar el error al enviar el formulario
      if (!email || !password) {
        setError('Por favor completa todos los campos');
        return;
      }

      const response = await axios.post('http://localhost:3000/api/auth/signin', {
        email,
        password
      });
      
      const token = response.data.token;
      const decodedToken = jwtDecode(token);

      if (decodedToken.hasOwnProperty('roles')) {
        const userRoles = decodedToken.roles;
        console.log('Roles del usuario:', userRoles);

        // Extrae el nombre de usuario del token
        const username = decodedToken.username;
        console.log('Nombre de usuario:', username);

        // Guardar el token en el almacenamiento local
        localStorage.setItem('token', token);

        if (userRoles.includes('cliente')) {
          console.log('Usuario cliente inició sesión');
          window.location.href = `/cliente/${username}`;
        } else if (userRoles.includes('barbero')) {
          console.log('Usuario barbero inició sesión');
          // Redirigir a la página del barbero
        } else if (userRoles.includes('admin')) {
          console.log('Usuario administrador inició sesión');
          // Redirigir a la página de administrador
        } else {
          console.log('Usuario con rol no definido inició sesión');
          // Redirigir a la página principal por defecto si el rol no está definido
        }
      } else {
        console.log('No se encontró el campo "roles" en el token de usuario');
      }

    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setError('Credenciales incorrectas');
    }
  };

  return (
    <div>
      <h2>Iniciar Sesión</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label>Contraseña:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit">Iniciar Sesión</button>
      </form>
    </div>
  );
};

export default Login;
