import React from 'react';
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Registro from './Ejercicio/Registrarse.js';
import Login from './Ejercicio/Login.js';
import PerfilUsuario from './Ejercicio/PerfilUsuario.js';
import PerfilAdmin from './Ejercicio/PerfilAdmin.js';
import PerfilBarbero from './Ejercicio/PerfilBarbero.js';


function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Registro />} />
          <Route path='/login' element={<Login />} />
          <Route path='/cliente/:username' element={<PerfilUsuario />} />
          <Route path='/admin/:username' element={<PerfilAdmin />} />
          <Route path='/barbero/:username' element={<PerfilBarbero />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
