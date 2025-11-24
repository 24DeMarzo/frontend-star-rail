import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'https://starraildb-production.up.railway.app';

function CartSidebar({ isOpen, onCloseClick, cartItems, onRemoveItem }) {
  const navigate = useNavigate();
  const cartClassName = `cart-sidebar ${isOpen ? 'open' : ''}`;

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('WebpayBypass'); 
  const [isProcessing, setIsProcessing] = useState(false);

  const calculateTotal = () => {
    if (!cartItems) return "0.00";
    return cartItems.reduce((total, item) => total + item.precio * item.quantity, 0).toFixed(2);
  };

  const handleInitiateCheckout = () => {
    const userString = localStorage.getItem('user');
    if (!userString) {
      alert("Debes iniciar sesión para comprar.");
      navigate('/login');
      onCloseClick();
      return;
    }
    setShowPaymentModal(true);
  };

  const handleConfirmPayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    const user = JSON.parse(localStorage.getItem('user'));
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); 

      const response = await fetch(`${API_BASE_URL}/api/webpay/simulate-success`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, total: calculateTotal(), items: cartItems })
      });
      
      if (response.ok) {
        setShowPaymentModal(false);
        onCloseClick(); 
        navigate('/perfil?status=success'); 
      } else {
        alert("Error en la simulación del servidor.");
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión con el simulador.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <aside className={cartClassName}>
        <div className="cart-header"><h2>Mi Carrito</h2><button onClick={onCloseClick}>&times;</button></div>
        <ul className="cart-items-list">
          {cartItems && cartItems.map(item => (
            <li className="cart-item" key={item.id}>
              <div className="cart-item-info"><p>{item.nombre} (x{item.quantity})</p><span>${(item.precio * item.quantity).toFixed(2)}</span></div>
              <button className="cart-item-remove-btn" onClick={() => onRemoveItem(item.id)}>&times;</button>
            </li>
          ))}
        </ul>
        <div className="cart-footer">
          <h3>Total: ${calculateTotal()}</h3>
          <button onClick={handleInitiateCheckout} className="cta-button cta-gold" disabled={!cartItems || cartItems.length === 0}>Ir a Pagar</button>
        </div>
      </aside>

      {showPaymentModal && (
        <div className="modal-overlay">
          <div className="payment-modal">
            <h2>Finalizar Compra</h2>
            <p className="total-amount">Total: <span>${calculateTotal()}</span></p>
            <form onSubmit={handleConfirmPayment}>
              <div className="form-group">
                <label>Método de Pago</label>
                {/* 👇 MENÚ SIMPLIFICADO: Solo opciones que funcionan */}
                <select 
                    value={paymentMethod} 
                    onChange={(e) => setPaymentMethod(e.target.value)} 
                    style={{width:'100%', padding:'10px', marginBottom:'15px'}}
                >
                  <option value="WebpayBypass">🟢 Webpay (Simulación)</option>
                  <option value="Tarjeta">💳 Tarjeta Crédito</option>
                </select>
              </div>

              <div style={{background:'rgba(0,255,0,0.1)', padding:'10px', borderRadius:'5px', marginBottom:'15px', border:'1px solid #ccffcc'}}>
                <p style={{fontSize:'0.9rem', color:'#ccffcc'}}>
                  Modo Seguro: Simulación de pago conectada a la Base de Datos.
                </p>
              </div>

              <div style={{display:'flex', gap:'10px'}}>
                <button type="submit" className="cta-button cta-gold" disabled={isProcessing} style={{flex:1}}>
                  {isProcessing ? 'Procesando...' : 'Pagar Ahora'}
                </button>
                <button type="button" className="cta-button" onClick={() => setShowPaymentModal(false)} style={{background:'#444', flex:1}} disabled={isProcessing}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default CartSidebar;