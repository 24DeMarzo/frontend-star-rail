import React from 'react';
import { Link } from 'react-router-dom';

function Navbar({ onCartClick, cartItemCount, user, onLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">Expreso Astral</Link>
      </div>
      
      <div className="navbar-links">
        <Link to="/">Inicio</Link>
        <Link to="/tienda">Tienda</Link>
        <Link to="/contacto">Contacto</Link>
        
        {/* --- BOTÓN DE ADMIN (SOLO VISIBLE SI ERES ADMIN) --- */}
        {user && user.role === 'admin' && (
          <Link 
            to="/admin" 
            style={{ 
              color: '#d4af37', 
              fontWeight: 'bold', 
              border: '1px solid #d4af37', 
              padding: '5px 10px', 
              borderRadius: '5px' 
            }}
          >
            ⚙️ Panel Admin
          </Link>
        )}
        {/* -------------------------------------------------- */}
      </div>

      <div className="navbar-actions">
        {user ? (
          <div className="user-info">
            <span className="user-greeting">Hola, <Link to="/perfil">{user.username}</Link></span>
            <button className="logout-btn" onClick={onLogout}>Salir</button>
          </div>
        ) : (
          <div className="auth-buttons">
            <Link to="/login" className="login-link">Login</Link>
            <Link to="/register" className="register-link">Registro</Link>
          </div>
        )}

        <button className="cart-btn" onClick={onCartClick}>
          🛒 <span className="cart-count">{cartItemCount}</span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;