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

    // Lógica de retorno de Webpay
    const query = new URLSearchParams(location.search);
    if (query.get('status') === 'success') {
      alert("¡Pago Exitoso! 🚀");
      navigate('/perfil', { replace: true });
    }

    fetchOrders(userData.id);
  }, [navigate, location]);

  const fetchOrders = async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/orders/user/${userId}`);
      if (response.ok) setOrders(await response.json());
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (!user) return <div className="profile-container">Cargando...</div>;

  return (
    <div className="profile-container">
      <h1>Perfil de Trazacaminos</h1>
      
      <div className="profile layout"> {/* Clases de tu CSS */}
        
        {/* Columna Izquierda: Info Usuario */}
        <div className="profile-balance">
          <div className="balance-card">
            <h2>{user.username}</h2>
            <p>{user.email}</p>
            <p>Rol: <strong>{user.role}</strong></p>
            <hr style={{borderColor: 'var(--accent-blue)', margin: '1rem 0'}}/>
            <button onClick={handleLogout} className="logout-btn" style={{width: '100%', padding: '10px'}}>
                Cerrar Sesión
            </button>
          </div>
        </div>

        {/* Columna Derecha: Historial */}
        <div className="profile-history">
          <h2>Historial de Pedidos</h2>
          {orders.length === 0 ? (
            <p>Aún no has realizado recargas.</p>
          ) : (
            <table className="history-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Método</th>
                  <th>Total</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id}>
                    <td>{new Date(order.fecha).toLocaleDateString()}</td>
                    <td>{order.payment_method}</td>
                    <td>${order.total}</td>
                    <td>{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
}

export default PerfilPage;