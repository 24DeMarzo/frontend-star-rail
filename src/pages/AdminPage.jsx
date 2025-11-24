import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../apiConfig';

function AdminPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({ users: 0, products: 0, sales: 0 });
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  
  // Estado para el Modal de Productos
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({ nombre: '', precio: '', imagen: '' });

  // DEFINICIÓN DE LA FUNCIÓN DE CARGA (FUERA DEL USEEFFECT)
  const fetchAllData = async () => {
    try {
      // 1. Cargar Estadísticas
      const resStats = await fetch(`${API_BASE_URL}/api/dashboard-stats`);
      if(resStats.ok) setStats(await resStats.json());

      // 2. Cargar Productos
      const resProd = await fetch(`${API_BASE_URL}/api/products`);
      if(resProd.ok) setProducts(await resProd.json());

      // 3. Cargar Usuarios
      const resUsers = await fetch(`${API_BASE_URL}/api/users`);
      if(resUsers.ok) setUsers(await resUsers.json());

      // 4. Cargar Mensajes
      const resMsgs = await fetch(`${API_BASE_URL}/api/messages`);
      if(resMsgs.ok) setMessages(await resMsgs.json());

    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'admin') {
      alert("Acceso denegado. Solo administradores.");
      navigate('/');
      return;
    }
    // Llamamos a la función que definimos arriba
    fetchAllData();
  }, [navigate]);

  // --- FUNCIONES DE PRODUCTOS ---
  const handleEditClick = (product) => {
    setEditingProduct(product);
    setFormData({ nombre: product.nombre, precio: product.precio, imagen: product.imagen });
    setIsModalOpen(true);
  };

  const handleCreateClick = () => {
    setEditingProduct(null);
    setFormData({ nombre: '', precio: '', imagen: '' });
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm("¿Seguro que quieres borrar este producto?")) return;
    try {
      await fetch(`${API_BASE_URL}/api/products/${id}`, { method: 'DELETE' });
      fetchAllData(); 
    } catch (error) {
      console.error("Error borrando:", error);
    }
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    const endpoint = editingProduct 
      ? `${API_BASE_URL}/api/products/${editingProduct.id}`
      : `${API_BASE_URL}/api/products`;
    
    const method = editingProduct ? 'PUT' : 'POST';

    try {
      await fetch(endpoint, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      setIsModalOpen(false);
      fetchAllData(); 
    } catch (error) {
      alert("Error guardando producto");
    }
  };

  return (
    <div className="admin-container">
      <h1 className="admin-title">Panel de Administración</h1>

      <div className="admin-tabs">
        <button className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>📊 Dashboard</button>
        <button className={activeTab === 'products' ? 'active' : ''} onClick={() => setActiveTab('products')}>🛍️ Productos</button>
        <button className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>👥 Usuarios</button>
        <button className={activeTab === 'messages' ? 'active' : ''} onClick={() => setActiveTab('messages')}>✉️ Mensajes</button>
      </div>

      <div className="admin-content">
        {activeTab === 'dashboard' && (
          <div className="dashboard-stats">
            <div className="stat-card"><h3>Usuarios</h3><p>{stats.users}</p></div>
            <div className="stat-card"><h3>Productos</h3><p>{stats.products}</p></div>
            <div className="stat-card"><h3>Ventas</h3><p>${stats.sales}</p></div>
          </div>
        )}

        {activeTab === 'products' && (
          <div>
            <div className="products-header">
              <h2>Inventario</h2>
              <button className="btn-add" onClick={handleCreateClick}>+ Nuevo</button>
            </div>
            <table className="admin-table">
              <thead><tr><th>ID</th><th>Nombre</th><th>Precio</th><th>Acciones</th></tr></thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.nombre}</td>
                    <td>${p.precio}</td>
                    <td>
                      <button className="btn-edit" onClick={() => handleEditClick(p)}>✏️</button>
                      <button className="btn-delete" onClick={() => handleDeleteClick(p.id)}>🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'users' && (
          <div>
            <h2>Usuarios</h2>
            <table className="admin-table">
              <thead><tr><th>ID</th><th>Usuario</th><th>Email</th><th>Rol</th></tr></thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}><td>{u.id}</td><td>{u.username}</td><td>{u.email}</td><td>{u.role}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'messages' && (
          <div>
            <h2>Mensajes de Contacto</h2>
            <table className="admin-table">
              <thead><tr><th>Fecha</th><th>Nombre</th><th>Asunto</th><th>Mensaje</th></tr></thead>
              <tbody>
                {messages.map(m => (
                  <tr key={m.id}>
                    <td>{new Date(m.fecha).toLocaleDateString()}</td>
                    <td>{m.nombre} <br/><small>{m.email}</small></td>
                    <td>{m.asunto}</td>
                    <td>{m.mensaje}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editingProduct ? 'Editar' : 'Crear'} Producto</h3>
            <form onSubmit={handleSubmitProduct}>
              <label>Nombre:</label><input value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} required />
              <label>Precio:</label><input type="number" step="0.01" value={formData.precio} onChange={e => setFormData({...formData, precio: e.target.value})} required />
              <label>Imagen:</label><input value={formData.imagen} onChange={e => setFormData({...formData, imagen: e.target.value})} />
              <div className="modal-actions">
                <button type="button" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                <button type="submit" className="btn-save">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPage;