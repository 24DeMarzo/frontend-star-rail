import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import CartSidebar from './CartSidebar';

function Layout() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      try {
        setCurrentUser(JSON.parse(user));
      } catch (e) {
        localStorage.clear();
      }
    }
    setIsLoading(false);
  }, []);

  const handleAddToCart = (productToAdd) => {
    setCartItems((prevItems) => {
      const isItemInCart = prevItems.find(item => item.id === productToAdd.id);
      if (isItemInCart) {
        return prevItems.map(item => 
          item.id === productToAdd.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevItems, { ...productToAdd, quantity: 1 }];
      }
    });
    setIsCartOpen(true);
  };

  const handleRemoveFromCart = (productId) => {
    setCartItems((prevItems) => 
      prevItems.filter(item => item.id !== productId)
    );
  };

  const handleLogin = (userData) => {
    localStorage.setItem('token', userData.token);
    localStorage.setItem('user', JSON.stringify(userData.user));
    setCurrentUser(userData.user);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
    navigate('/');
  };

  if (isLoading) {
    return null;
  }

  return (
    <>
      <Navbar 
        onCartClick={() => setIsCartOpen(true)} 
        cartItemCount={cartItems.reduce((total, item) => total + item.quantity, 0)}
        user={currentUser}
        onLogout={handleLogout}
      />

      <CartSidebar 
        isOpen={isCartOpen} 
        onCloseClick={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveItem={handleRemoveFromCart}
      />
      
      <main>
        <Outlet 
          context={{ 
            onAddToCart: handleAddToCart,
            onLogin: handleLogin,
            currentUser: currentUser
          }} 
        /> 
      </main>
      <Footer />
    </>
  );
}

export default Layout;