import React, { useState } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';

const API_BASE_URL = 'https://starraildb-production.up.railway.app';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { onLogin } = useOutletContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        onLogin(data); 
        
        // Redirección
        navigate('/perfil');
      } else {
        alert("❌ Error: " + (data.message || "Credenciales incorrectas"));
      }

    } catch (error) {
      console.error('Error al conectar con el servidor:', error);
      alert('⚠️ No se pudo conectar con el servidor. Revisa tu conexión.');
    } finally {
      setLoading(false); // Desbloqueamos botón
    }
  };

  return (
    <main className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Iniciar Sesión</h2>
        
        <div className="form-group">
          <label htmlFor="email">Correo Electrónico</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nombre@ejemplo.com"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input 
            type="password" 
            id="password" 
            name="password" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
          />
        </div>
        
        <button type="submit" className="cta-button cta-gold login-button" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
        
        <p className="register-link">
          ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
        </p>
      </form>
    </main>
  );
}

export default LoginPage;