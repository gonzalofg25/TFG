import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function SignUpForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    roles: []
  });
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validación de campos obligatorios
    if (!formData.username || !formData.email || !formData.password) {
      setErrorMessage('Por favor, complete todos los campos obligatorios.');
      return;
    }
    // Validación de selección de roles
    if (formData.roles.length === 0) {
      setErrorMessage('Por favor, seleccione al menos un rol.');
      return;
    }
    try {
      const response = await axios.post('https://tfg-ndno.onrender.com/api/auth/signup', formData);
      setErrorMessage('');
      console.log('Respuesta del servidor:', response.data);
      // Muestra una alerta con el mensaje de éxito
      alert('Usuario registrado correctamente');
      // Redirige al usuario a la página de inicio de sesión después de un registro exitoso
      window.location.href = '/login';
    } catch (error) {
      if (error.response) {
        if (error.response.status === 409) {
          setErrorMessage('El correo electrónico proporcionado ya está en uso');
        } else {
          setErrorMessage('Error en el servidor, por favor inténtelo de nuevo más tarde');
        }
      } else {
        setErrorMessage('Error de conexión, por favor verifique su conexión a Internet');
      }
      console.error('Error:', error);
    }
  };

  const handleRadioChange = (e) => {
    const { value } = e.target;
    setFormData({ ...formData, roles: [value] });
  };

  return (
    <div id="registro-container">
  <form id="registro-formulario" onSubmit={handleSubmit}>
    <div id='formulario'>
    <h1>Registro</h1>
    <input className="campo-texto" type="text" name="username" placeholder="Nombre de usuario" onChange={handleChange} />
    <input className="campo-texto" type="email" name="email" placeholder="Correo electrónico" onChange={handleChange} />
    <input className="campo-texto" type="password" name="password" placeholder="Contraseña" onChange={handleChange} />
    <div className="roles-container">
      <label>
        <input type="radio" name="roles" value="cliente" onChange={handleRadioChange} />
        Cliente
      </label>
      <label>
        <input type="radio" name="roles" value="barbero" onChange={handleRadioChange} />
        Barbero
      </label>
    </div>
    {errorMessage && <p className="error-message">{errorMessage}</p>}
    <button className="submit-button" type="submit">Registrarse</button>
    {/* Enlace para ir a la página de inicio de sesión */}
    <p>¿Ya tienes una cuenta? <Link to="/login" id='enlace'>Iniciar sesión</Link></p>
    </div>
  </form>
</div>

  );
}

export default SignUpForm;
