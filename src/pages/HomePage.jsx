import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
    return(
        <>
            <section className="hero">
            <div className="hero-content">
                <h1>Recarga tus Esquirlas Oníricas</h1>
                <p>El combustible para tu viaje por el Expreso Astral.</p>
                <a href="tienda.html" className="cta-button cta-gold">Ver Paquetes</a>
            </div>
        </section>
        <section className="featured-products">
            <h2>Paquetes Más Populares</h2>
            <div className="card-container">
                </div>
        </section>
        <section className="current-banners">
            <h2>Banners Actuales</h2>
            <div className="banner-container">
                <div className="banner-card">
                    <p>Banner de Personaje: "Acheron"</p>
                </div>
                <div className="banner-card">
                    <p>Banner de Conos de Luz</p>
                </div>
            </div>
        </section>
        </>
    );
}
export default HomePage;