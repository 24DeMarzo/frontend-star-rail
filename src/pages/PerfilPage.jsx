import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const API_BASE_URL = 'https://starraildb-production.up.railway.app';

function PerfilPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (!userString) {
      navigate('/login');
      return;
    }
    const userData = JSON.parse(userString);
    setUser(userData);

    const query = new URLSearchParams(location.search);
    const status = query.get('status');
    
    if (status === 'success') {
      alert("¡Pago Exitoso! Tu compra ha sido registrada. 🚀");
      navigate('/perfil', { replace: true });
    } else if (status === 'failure') {
      alert("El pago falló o fue anulado. 😢");
    }

    fetchOrders(userData.id);
  }, [navigate, location]);

  const fetchOrders = async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/orders/user/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Error cargando historial:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (!user) return <div className="perfil-container">Cargando perfil...</div>;

  return (
    <div className="perfil-container">
      <h1>Perfil de {user.username}</h1>
      <div className="perfil-info">
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Rol:</strong> {user.role}</p>
        <button onClick={handleLogout} className="logout-btn-large">Cerrar Sesión</button>
      </div>

      <div className="order-history">
        <h2>Historial de Pedidos</h2>
        {orders.length === 0 ? (
          <p>No tienes pedidos aún.</p>
        ) : (
          <table className="orders-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Fecha</th>
                <th>Método</th>
                <th>Total</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{new Date(order.fecha).toLocaleDateString()}</td>
                  <td>{order.payment_method}</td>
                  <td>${order.total}</td>
                  <td>
                    <span className={`status-badge ${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default PerfilPage;