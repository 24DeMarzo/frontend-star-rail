import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Enviando datos a la nube...", formData);

    try {
      const response = await fetch('https://backend-star-rail-production.up.railway.app/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      console.log("Respuesta del servidor (Status):", response.status);

      const data = await response.json();
      console.log("Respuesta del servidor (Data):", data);

      if (response.ok) {
        alert("¡Registro Exitoso! Ahora inicia sesión.");
        navigate('/login');
      } else {
        alert("Error: " + (data.message || "No se pudo registrar"));
      }
    } catch (error) {
      console.error("Error GRAVE de conexión:", error);
      alert("Error de conexión. Revisa la consola (F12) para ver detalles.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Registro de Trazacaminos</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" name="username" placeholder="Nombre de usuario" 
          onChange={handleChange} required 
        />
        <input 
          type="email" name="email" placeholder="Correo electrónico" 
          onChange={handleChange} required 
        />
        <input 
          type="password" name="password" placeholder="Contraseña" 
          onChange={handleChange} required 
        />
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
}

export default RegisterPage;