import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

function TiendaPage() {
  const [products, setProducts] = useState([]);
  const { onAddToCart } = useOutletContext();

  useEffect(() => {
    fetch('http://localhost:4000/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("Error cargando productos:", err));
  }, []);

  return (
    <main className="store-container">
      <h1>Tienda de Esquirlas Oníricas</h1>
      <p>Selecciona un paquete para recargar tu cuenta.</p>
      
      <div className="store-grid">
        {products.length === 0 ? (
          <p>Cargando productos...</p>
        ) : (
          products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={onAddToCart}
            />
          ))
        )}
      </div>
    </main>
  );
}

export default TiendaPage;