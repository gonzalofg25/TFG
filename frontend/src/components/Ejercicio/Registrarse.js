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

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    let updatedRoles = [...formData.roles];
    if (checked) {
      updatedRoles.push(value);
    } else {
      updatedRoles = updatedRoles.filter(role => role !== value);
    }
    setFormData({ ...formData, roles: updatedRoles });
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
      const response = await axios.post('http://localhost:3000/api/auth/signup', formData);
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

  return (
    <form onSubmit={handleSubmit}>
      <h1>Registro</h1>
      <input type="text" name="username" placeholder="Nombre de usuario" onChange={handleChange} />
      <input type="email" name="email" placeholder="Correo electrónico" onChange={handleChange} />
      <input type="password" name="password" placeholder="Contraseña" onChange={handleChange} />
      <div>
        <label>
          <input type="checkbox" name="roles" value="cliente" onChange={handleCheckboxChange} />
          Cliente
        </label>
        <label>
          <input type="checkbox" name="roles" value="barbero" onChange={handleCheckboxChange} />
          Barbero
        </label>
        <label>
          <input type="checkbox" name="roles" value="admin" onChange={handleCheckboxChange} />
          Administrador
        </label>
      </div>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <button type="submit">Registrarse</button>
      {/* Enlace para ir a la página de inicio de sesión */}
      <p>¿Ya tienes una cuenta? <Link to="/login">Iniciar sesión</Link></p>
    </form>
  );
}

export default SignUpForm;
