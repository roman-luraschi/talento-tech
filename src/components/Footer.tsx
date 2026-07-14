import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import '../css/Footer.css'
import Directorio from './Directorio'
import { getEquipo } from '../firestore/equipo/equipoService'
import { mapErrorMessage } from '../lib/errors/mapErrorMessage'
import type { Integrante } from '../types/equipo'

function Footer() {
  const year = new Date().getFullYear()
  const [equipo, setEquipo] = useState<Integrante[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const loadEquipo = async (): Promise<void> => {
      setCargando(true)
      setError(null)

      try {
        const data = await getEquipo()
        if (!cancelled) {
          setEquipo(data)
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setError(mapErrorMessage(err, 'equipo'))
          setEquipo([])
        }
      }
      if (!cancelled) {
        setCargando(false)
      }
    }

    void loadEquipo()

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <footer id="contacto" className="footer" aria-labelledby="footer-heading">
      <div className="footer__accent" aria-hidden />
      <div className="footer__inner">
        <Directorio equipo={equipo} cargando={cargando} error={error} />
        <div className="footer__main">
          <div className="footer__brand-block">
            <h2 id="footer-heading" className="footer__brand">
              Talento Tech Store
            </h2>
            <p className="footer__tagline">
              Una tienda chica, con ganas de que encuentres lo que necesitás.
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
              Usamos tus datos solo para operar el sitio: pedidos, consultas y
              mejoras. No los vendemos ni los usamos para publicidad de terceros
              sin que nos lo digas.
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
              Al comprar acá aceptás estos términos. Los precios y el stock pueden
              cambiar. Si algo no cierra, escribinos por los contactos de esta
              página.
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
