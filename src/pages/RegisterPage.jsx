import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
        navigate('/login');
      } else {
        alert(data.message);
      }

    } catch (error) {
      console.error('Error al conectar con el servidor:', error);
      alert('No se pudo conectar con el servidor. Intenta más tarde.');
    }
  };

  return (
    <main className="login-container">
      <form className="login-form register-form" onSubmit={handleSubmit}>
        <h2>Crear Cuenta</h2>
        
        <div className="form-group">
          <label htmlFor="username">Nombre de Usuario</label>
          <input 
            type="text" 
            id="username" 
            name="username" 
            required 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Correo Electrónico</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          />
        </div>

        <div className="form-group">
          <label htmlFor="password-confirm">Confirmar Contraseña</label>
          <input 
            type="password" 
            id="password-confirm" 
            name="password-confirm" 
            required 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        
        <button type="submit" className="cta-button cta-gold login-button">
          Registrarse
        </button>
        
        <p className="register-link">
          ¿Ya tienes cuenta? <Link to="/login">Inicia Sesión aquí</Link>
        </p>
      </form>
    </main>
  );
}

export default RegisterPage;