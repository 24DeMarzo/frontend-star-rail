import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'https://starraildb-production.up.railway.app'; 

function RegisterPage() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const finalEndpoint = `${API_BASE_URL}/api/register`;
    
    console.log("🔗 CONECTANDO A:", finalEndpoint);

    try {
      const response = await fetch(finalEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ ¡Registro Exitoso! ID: " + data.userId);
        navigate('/login');
      } else {
        alert("❌ Error: " + (data.message || "Error desconocido"));
      }
    } catch (error) {
      console.error(error);
      alert("⚠️ Error de conexión. Revisa la consola.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Registro</h2>
      <form onSubmit={handleSubmit}>
        <input name="username" placeholder="Usuario" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Pass" onChange={handleChange} required />
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
}

export default RegisterPage;