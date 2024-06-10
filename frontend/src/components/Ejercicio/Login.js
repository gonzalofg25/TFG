import React, { useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [redirected, setRedirected] = useState(false); // Estado para controlar la redirección

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(''); // Limpiar el error al enviar el formulario
      if (!email || !password) {
        setError('Por favor completa todos los campos');
        return;
      }

      const response = await axios.post('http://https://tfg-ndno.onrender.com/api/auth/signin', {
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
          window.location.href = `/barbero/${username}`;
        } else if (userRoles.includes('admin')) {
          console.log('Usuario administrador inició sesión');
          window.location.href = `/admin/${username}`;
        } else {
          console.log('Usuario con rol no definido inició sesión');
          // Redirigir a la página principal por defecto si el rol no está definido
        }
        // Marcar que se ha redirigido
        setRedirected(true);
      } else {
        console.log('No se encontró el campo "roles" en el token de usuario');
      }

    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setError('Credenciales incorrectas');
    }
  };

  // Mostrar el mensaje de error solo si no se ha redirigido
  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <div id='formulario-login'>
          <h1 className="login-title">Iniciar Sesión</h1>
            <input className='campo-login' type="email" id="email" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />          
            <input className='campo-login' type="password" id="password" placeholder='Contraseña' value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && !redirected && <p id="error-message" className="error-message">{error}</p>} {/* Mostrar el mensaje solo si no se ha redirigido */}
          <button type="submit" className="login-button">Iniciar Sesión</button>
          <p>¿No eres usuario? <Link to="/" id='enlace'> Crear usuario</Link></p>
        </div>
      </form>
    </div>
  );
};

export default Login;
