import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CartSidebar({ isOpen, onCloseClick, cartItems, onRemoveItem }) {
  const navigate = useNavigate();
  const cartClassName = `cart-sidebar ${isOpen ? 'open' : ''}`;

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  // Por defecto usamos la simulación para que no falles en la demo
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

    // --- OPCIÓN 1: WEBPAY REAL (Transbank) ---
    if (paymentMethod === 'Webpay') {
      try {
        const response = await fetch('http://localhost:4000/api/webpay/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id, total: calculateTotal(), items: cartItems })
        });
        const data = await response.json();

        if (response.ok) {
          const form = document.createElement("form");
          form.method = "POST";
          form.action = data.url;
          const tokenInput = document.createElement("input");
          tokenInput.type = "hidden";
          tokenInput.name = "token_ws";
          tokenInput.value = data.token;
          form.appendChild(tokenInput);
          document.body.appendChild(form);
          form.submit(); 
        } else {
          alert("Error Webpay: " + data.message);
          setIsProcessing(false);
        }
      } catch (error) {
        alert("Error de conexión.");
        setIsProcessing(false);
      }
      return;
    }

    // --- OPCIÓN 2: WEBPAY SIMULADO (EL SALVAVIDAS) ---
    if (paymentMethod === 'WebpayBypass') {
      // Simulamos una pequeña carga para que se vea real
      await new Promise(resolve => setTimeout(resolve, 1500)); 

      try {
        const response = await fetch('http://localhost:4000/api/webpay/simulate-success', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id, total: calculateTotal(), items: cartItems })
        });
        
        if (response.ok) {
          // Redirigimos al perfil con mensaje de éxito (igual que haría Transbank)
          window.location.href = '/perfil?status=success';
        } else {
          alert("Error en la simulación.");
          setIsProcessing(false);
        }
      } catch (error) {
        alert("Error de conexión simulación.");
        setIsProcessing(false);
      }
      return;
    }

    // --- OPCIÓN 3: TARJETA CRÉDITO FALSA ---
    // (Lógica antigua simple)
    await new Promise(resolve => setTimeout(resolve, 2000));
    // ... aquí podrías poner lógica para tarjeta simple si quieres, 
    // pero con el Bypass ya tienes cubierto lo de "Webpay"
    window.location.href = '/perfil?status=success';
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
                <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} style={{width:'100%', padding:'10px', marginBottom:'15px'}}>
                  {/* ESTA ES LA OPCIÓN QUE USARÁS AHORA */}
                  <option value="WebpayBypass">🟢 Webpay (Simulación Local)</option>
                  <option value="Webpay">🔴 Webpay Plus (Transbank Real)</option>
                  <option value="Tarjeta">💳 Tarjeta Crédito (Simulada)</option>
                </select>
              </div>

              {paymentMethod === 'WebpayBypass' && (
                <div style={{background:'rgba(0,255,0,0.1)', padding:'10px', borderRadius:'5px', marginBottom:'15px', border:'1px solid #ccffcc'}}>
                  <p style={{fontSize:'0.9rem', color:'#ccffcc'}}>
                    Modo desarrollador: Simula el flujo completo de Webpay sin conectar con Transbank (Útil si el servidor de pruebas está caído).
                  </p>
                </div>
              )}

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