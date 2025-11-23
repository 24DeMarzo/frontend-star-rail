import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { WebpayPlus } from 'transbank-sdk';
import { Options, IntegrationApiKeys, Environment, IntegrationCommerceCodes } from 'transbank-sdk';

function PerfilPage() {
  const { currentUser } = useOutletContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar historial al montar el componente
  useEffect(() => {
    if (currentUser?.id) {
      fetch(`http://localhost:4000/api/orders/user/${currentUser.id}`)
        .then(res => res.json())
        .then(data => {
          setOrders(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error cargando historial:", err);
          setLoading(false);
        });
    }
  }, [currentUser]);

  if (!currentUser) return <div className="profile-container"><h1>Cargando...</h1></div>;

  return (
    <main className="profile-container">
      <h1>Mi Perfil</h1>
      
      <div className="profile-layout">
        
        {/* SECCIÓN IZQUIERDA: INFO USUARIO */}
        <section className="profile-balance">
          <h2>Bienvenido, {currentUser.username}</h2>
          <div className="balance-card">
            <p>Rol de Cuenta:</p>
            <span className="balance-amount" style={{fontSize: '1.5rem'}}>
              {currentUser.role === 'admin' ? '👑 Administrador' : '🚀 Trazacaminos'}
            </span>
            <p className="balance-currency">{currentUser.email}</p>
          </div>
          <Link to="/tienda" className="cta-button cta-gold">Ir a la Tienda</Link>
        </section>
        
        {/* SECCIÓN DERECHA: HISTORIAL REAL */}
        <section className="profile-history">
          <h2>Historial de Compras</h2>
          
          {loading ? (
            <p>Cargando historial...</p>
          ) : orders.length === 0 ? (
            <div style={{textAlign: 'center', padding: '20px'}}>
              <p>Aún no has realizado compras.</p>
              <Link to="/tienda" style={{color: 'var(--accent-gold)'}}>¡Haz tu primera recarga!</Link>
            </div>
          ) : (
            <table className="history-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Detalles (Items)</th>
                  <th>Método</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    {/* Formatear fecha */}
                    <td>{new Date(order.fecha).toLocaleDateString()}</td>
                    
                    {/* Mostrar items (ej: "60 Esquirlas (x1)") */}
                    <td>
                      <ul style={{listStyle: 'none', padding: 0, margin: 0, fontSize: '0.9rem'}}>
                        {order.items.map((item, index) => (
                          <li key={index}>• {item.nombre} <span style={{opacity: 0.7}}>(x{item.quantity})</span></li>
                        ))}
                      </ul>
                    </td>

                    <td>{order.payment_method}</td>
                    
                    <td style={{color: 'var(--accent-gold)', fontWeight: 'bold'}}>
                      ${order.total}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

      </div>
    </main>
  );
}

export default PerfilPage;