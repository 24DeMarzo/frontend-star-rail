import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const API_BASE_URL = 'https://starraildb-production.up.railway.app';

function RegisterPage() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username: formData.username, 
          email: formData.email, 
          password: formData.password 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('✨ ¡Registro exitoso! Ahora puedes iniciar sesión.');
        navigate('/login');
      } else {
        alert("❌ Error: " + (data.message || "No se pudo registrar"));
      }

    } catch (error) {
      console.error(error);
      alert('⚠️ No se pudo conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Crear Cuenta</h2>
        
        <div className="form-group">
          <label htmlFor="username">Nombre de Usuario</label>
          <input 
            type="text" 
            name="username" 
            required 
            onChange={handleChange}
            placeholder="Ej: Caelus"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Correo Electrónico</label>
          <input 
            type="email" 
            name="email" 
            required 
            onChange={handleChange}
            placeholder="nombre@ejemplo.com"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input 
            type="password" 
            name="password" 
            required 
            onChange={handleChange}
            placeholder="********"
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmar Contraseña</label>
          <input 
            type="password" 
            name="confirmPassword" 
            required 
            onChange={handleChange}
            placeholder="********"
          />
        </div>
        
        <button type="submit" className="cta-button cta-gold login-button" disabled={loading}>
          {loading ? 'Procesando...' : 'Registrarse'}
        </button>
        
        <div className="register-link">
          ¿Ya tienes cuenta? <Link to="/login">Inicia Sesión aquí</Link>
        </div>
      </form>
    </main>
  );
}

export default RegisterPage;