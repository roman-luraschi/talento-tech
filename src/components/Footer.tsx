import { Link } from 'react-router-dom'
import '../css/Footer.css'
import Directorio from './Directorio'

function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer id="contacto" className="footer" aria-labelledby="footer-heading">
      <div className="footer__accent" aria-hidden />
      <div className="footer__inner">
        <Directorio />
        <div className="footer__main">
          <div className="footer__brand-block">
            <h2 id="footer-heading" className="footer__brand">
              Talento Tech Store
            </h2>
            <p className="footer__tagline">
              Productos seleccionados y atención personalizada.
            </p>
          </div>
          <nav className="footer__nav" aria-label="Pie de página">
            <ul className="footer__links">
              <li>
                <Link to="/#privacidad">Privacidad</Link>
              </li>
              <li>
                <Link to="/#terminos">Términos</Link>
              </li>
              <li>
                <Link to="/#contacto">Contacto</Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className="footer__legal">
          <section
            id="privacidad"
            className="footer__legal-block"
            aria-labelledby="footer-privacidad-heading"
            tabIndex={-1}
          >
            <h3 id="footer-privacidad-heading" className="footer__legal-title">
              Política de privacidad
            </h3>
            <p className="footer__legal-text">
              Tratamos tus datos personales con fines operativos del sitio (pedidos,
              consultas y mejoras). No compartimos información con terceros para
              publicidad sin tu consentimiento.
            </p>
          </section>
          <section
            id="terminos"
            className="footer__legal-block"
            aria-labelledby="footer-terminos-heading"
            tabIndex={-1}
          >
            <h3 id="footer-terminos-heading" className="footer__legal-title">
              Términos y condiciones
            </h3>
            <p className="footer__legal-text">
              Al usar Talento Tech Store aceptás estas condiciones. Los precios y la
              disponibilidad pueden variar. Para reclamos, contactanos por los medios
              indicados en esta página.
            </p>
          </section>
        </div>
        <div className="footer__bottom">
          <p className="footer__copy">
            © {year} Talento Tech. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
