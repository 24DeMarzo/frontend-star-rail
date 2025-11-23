import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

import HomePage from './pages/HomePage';
import TiendaPage from './pages/TiendaPage';
import PerfilPage from './pages/PerfilPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ContactoPage from './pages/ContactoPage';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* El Layout abre aquí */}
        <Route path="/" element={<Layout />}>
          
          {/* --- Rutas Públicas (DENTRO del Layout) --- */}
          <Route index element={<HomePage />} />
          <Route path="tienda" element={<TiendaPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="contacto" element={<ContactoPage />} />

          {/* --- Rutas Protegidas --- */}
          <Route element={<ProtectedRoute />}>
            <Route path="perfil" element={<PerfilPage />} />
          </Route>
          
          {/* --- Rutas Admin --- */}
          <Route element={<AdminRoute />}>
            <Route path="admin" element={<AdminPage />} />
          </Route>

          <Route path="*" element={<div>404 - No Encontrado</div>} />

        </Route>
        {/* IMPORTANTE: El Layout cierra aquí */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;