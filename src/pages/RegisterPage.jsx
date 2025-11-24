import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../../src/style.css';

const API_BASE_URL = 'https://starraildb-production.up.railway.app'; 

function RegisterPage() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const finalEndpoint = `${API_BASE_URL}/api/register`;
    
    try {
      const response = await fetch(finalEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        alert("✨ ¡Bienvenido al Expreso Astral! Registro exitoso.");
        navigate('/login');
      } else {
        alert("❌ Error: " + (data.message || "Error desconocido"));
      }
    } catch (error) {
      console.error(error);
      alert("⚠️ Error de conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <h2 className="auth-title">Registro de Trazacaminos</h2>
        <p className="auth-subtitle">Únete a la aventura estelar</p>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Nombre de Usuario</label>
            <input 
              type="text" 
              name="username" 
              className="form-input"
              placeholder="Ej: Kafka" 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="form-group">
            <label>Correo Electrónico</label>
            <input 
              type="email" 
              name="email" 
              className="form-input"
              placeholder="ejemplo@astral.com" 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input 
              type="password" 
              name="password" 
              className="form-input"
              placeholder="********" 
              onChange={handleChange} 
              required 
            />
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Procesando...' : 'Registrarse'}
          </button>
        </form>

        <p className="auth-footer">
          ¿Ya tienes cuenta? <Link to="/login" className="auth-link">Inicia Sesión aquí</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;