import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function AdminPage() {
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, products, users
  
  // Datos
  const [stats, setStats] = useState({ users: 0, products: 0, sales: 0 });
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);

  // Estados para el formulario de Productos
  const [prodNombre, setProdNombre] = useState('');
  const [prodPrecio, setProdPrecio] = useState('');
  const [prodImagen, setProdImagen] = useState('');
  const [editingId, setEditingId] = useState(null);

  // --- CARGA DE DATOS ---
  const fetchAllData = () => {
    // 1. Cargar Estadísticas
    fetch('https://backend-star-rail-production.up.railway.app/api/dashboard-stats')
      .then(res => res.json())
      .then(data => setStats(data));

    // 2. Cargar Productos
    fetch('https://backend-star-rail-production.up.railway.app/api/products')
      .then(res => res.json())
      .then(data => setProducts(data));

    // 3. Cargar Usuarios
    fetch('https://backend-star-rail-production.up.railway.app/api/users')
      .then(res => res.json())
      .then(data => setUsers(data));
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // --- LÓGICA DE PRODUCTOS (Crear/Editar/Borrar) ---
  const handleEditClick = (product) => {
    setActiveTab('products'); // Asegurar que estamos en la tab correcta
    setEditingId(product.id);
    setProdNombre(product.nombre);
    setProdPrecio(product.precio);
    setProdImagen(product.imagen || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setProdNombre('');
    setProdPrecio('');
    setProdImagen('');
  };

  const handleSubmitProduct = async (event) => {
    event.preventDefault();
    const productData = { nombre: prodNombre, precio: prodPrecio, imagen: prodImagen };
    
    let url = 'https://backend-star-rail-production.up.railway.app/api/products';
    let method = 'POST';
    if (editingId) {
      url = `https://backend-star-rail-production.up.railway.app/api/products/${editingId}`;
      method = 'PUT';
    }

    const res = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    });

    if (res.ok) {
      alert(editingId ? 'Actualizado' : 'Creado');
      handleCancelEdit();
      fetchAllData(); // Recargar todo
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("¿Borrar producto?")) return;
    await fetch(`https://backend-star-rail-production.up.railway.app/api/products/${id}`, { method: 'DELETE' });
    fetchAllData();
  };

  // --- RENDERIZADO DE TABS ---

  return (
    <main className="admin-container">
      <h1>Panel de Control - Expreso Astral</h1>
      
      {/* MENÚ DE NAVEGACIÓN DEL ADMIN */}
      <div className="admin-tabs">
        <button 
          className={activeTab === 'dashboard' ? 'active' : ''} 
          onClick={() => setActiveTab('dashboard')}
        >
          📊 Resumen
        </button>
        <button 
          className={activeTab === 'products' ? 'active' : ''} 
          onClick={() => setActiveTab('products')}
        >
          📦 Productos
        </button>
        <button 
          className={activeTab === 'users' ? 'active' : ''} 
          onClick={() => setActiveTab('users')}
        >
          👥 Usuarios
        </button>
      </div>

      {/* --- TAB 1: DASHBOARD --- */}
      {activeTab === 'dashboard' && (
        <div className="dashboard-view">
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Usuarios Totales</h3>
              <p className="stat-number">{stats.users}</p>
            </div>
            <div className="stat-card">
              <h3>Productos Activos</h3>
              <p className="stat-number">{stats.products}</p>
            </div>
            <div className="stat-card">
              <h3>Ventas Totales</h3>
              <p className="stat-number">${stats.sales}</p>
            </div>
          </div>

          {/* GRÁFICA SIMPLE CSS */}
          <div className="chart-section">
            <h2>Estadísticas de la Tienda</h2>
            <div className="simple-bar-chart">
              <div className="bar-group">
                <div className="bar" style={{ height: `${stats.users * 10}px`, background: '#9b59b6' }}></div>
                <span>Usuarios</span>
              </div>
              <div className="bar-group">
                <div className="bar" style={{ height: `${stats.products * 10}px`, background: '#3498db' }}></div>
                <span>Productos</span>
              </div>
              <div className="bar-group">
                <div className="bar" style={{ height: '5px', background: '#f1c40f' }}></div>
                <span>Ventas</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 2: PRODUCTOS (CRUD) --- */}
      {activeTab === 'products' && (
        <div className="products-view">
          <section className="admin-form-section">
            <h2>{editingId ? 'Editar Producto' : 'Añadir Nuevo'}</h2>
            <form className="login-form admin-form" onSubmit={handleSubmitProduct}>
              <div className="form-group">
                <label>Nombre</label>
                <input type="text" value={prodNombre} onChange={e => setProdNombre(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Precio</label>
                <input type="number" step="0.01" value={prodPrecio} onChange={e => setProdPrecio(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Imagen URL</label>
                <input type="text" value={prodImagen} onChange={e => setProdImagen(e.target.value)} />
              </div>
              <div style={{display:'flex', gap:'10px'}}>
                <button type="submit" className="cta-button cta-gold login-button">{editingId ? 'Actualizar' : 'Guardar'}</button>
                {editingId && <button type="button" onClick={handleCancelEdit} className="cta-button">Cancelar</button>}
              </div>
            </form>
          </section>

          <section className="admin-list-section">
            <h2>Inventario</h2>
            <table className="history-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Producto</th>
                  <th>Precio</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.nombre}</td>
                    <td>${p.precio}</td>
                    <td>
                      <button onClick={() => handleEditClick(p)} style={{marginRight:'10px', cursor:'pointer'}}>✏️ Editar</button>
                      <button onClick={() => handleDeleteProduct(p.id)} style={{color:'red', cursor:'pointer'}}>🗑️ Borrar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>
      )}

      {/* --- TAB 3: USUARIOS --- */}
      {activeTab === 'users' && (
        <div className="users-view">
          <h2>Usuarios Registrados</h2>
          <table className="history-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Usuario</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Fecha Registro</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: '4px', 
                      background: u.role === 'admin' ? '#d4af37' : '#444',
                      color: u.role === 'admin' ? 'black' : 'white'
                    }}>
                      {u.role}
                    </span>
                  </td>
                  <td>{new Date(u.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </main>
  );
}

export default AdminPage;