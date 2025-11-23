import React from "react";
import { Link } from "react-router-dom";

function Footer() {
    return(
        <footer>
            <ul className="footer-links">
                <li><Link to="#">Soporte</Link></li>
                <li><Link to="/contacto">Contacto</Link></li>
                <li><Link to="#">Terminos de Servicio</Link></li>
                <li><Link to="#">Politicas de privacidad</Link></li>
            </ul>
            <p> Sitio de simulación con fines educativos. Honkai: Star Rail © HoYovese.</p>
        </footer>
    );
}
export default Footer;