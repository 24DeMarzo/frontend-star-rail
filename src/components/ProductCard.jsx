import React from 'react';

function ProductCard({ product, onAddToCart }) {
  const { nombre, precio, imagen } = product;

  return (
    <article className="card">
      <img src={imagen} alt={nombre} className="card-image" />
      <h3>{nombre}</h3>
      <p className="price">${precio} USD</p>
      <button 
        onClick={() => onAddToCart(product)} 
        className="cta-button cta-blue"
      >
        Añadir al Carrito
      </button>
    </article>
  );
}

export default ProductCard;