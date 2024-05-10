import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Registro from './Ejercicio/Registrarse.js';
import Login from './Ejercicio/Login.js';
import PerfilUsuario from './Ejercicio/PerfilUsuario.js';

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Registro />} />
          <Route path='/login' element={<Login />} />
          <Route path='/cliente/:username' element={<PerfilUsuario />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
