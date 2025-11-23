import React, { useState } from 'react';

function ContactoPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    asunto: 'Consulta General', // Valor por defecto
    mensaje: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🟢 Intentando enviar mensaje...", formData); // CHIVATO 1

    try {
      const response = await fetch('http://localhost:4000/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      console.log("🟡 Respuesta del servidor:", response.status); // CHIVATO 2

      if (response.ok) {
        alert("¡Mensaje enviado correctamente! ✅");
        setFormData({ nombre: '', email: '', asunto: 'Consulta General', mensaje: '' }); 
      } else {
        const errorData = await response.json();
        console.error("🔴 Error Backend:", errorData); // CHIVATO 3
        alert("Error al enviar: " + (errorData.error || "Error desconocido"));
      }
    } catch (error) {
      console.error("❌ Error de Conexión:", error);
      alert("Error: El servidor backend parece estar apagado.");
    }
  };

  return (
    <main className="contact-container">
      <h1>Contáctanos</h1>
      <p>¿Tienes problemas con tu recarga? Estamos aquí para ayudar.</p>
      
      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nombre">Nombre</label>
          <input 
            type="text" 
            id="nombre" 
            name="nombre" 
            required 
            value={formData.nombre} 
            onChange={handleChange} 
            placeholder="Tu nombre"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Correo Electrónico</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            required 
            value={formData.email} 
            onChange={handleChange} 
            placeholder="ejemplo@correo.com"
          />
        </div>

        <div className="form-group">
          <label htmlFor="asunto">Asunto</label>
          <select 
            id="asunto" 
            name="asunto" 
            value={formData.asunto} 
            onChange={handleChange}
          >
            <option value="Soporte Técnico">Soporte Técnico</option>
            <option value="Problema de Pago">Problema de Pago</option>
            <option value="Consulta General">Consulta General</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="mensaje">Mensaje</label>
          <textarea 
            id="mensaje" 
            name="mensaje" 
            rows="5" 
            required 
            value={formData.mensaje} 
            onChange={handleChange}
            placeholder="Escribe tu consulta aquí..."
          ></textarea>
        </div>

        <button type="submit" className="cta-button cta-gold">Enviar Mensaje</button>
      </form>
    </main>
  );
}

export default ContactoPage;