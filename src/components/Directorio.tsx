import type { Integrante } from '../types/equipo'
import TarjetaContacto from './TarjetaContacto'

interface DirectorioProps {
  equipo: Integrante[]
  cargando: boolean
  error: string | null
}

function Directorio({ equipo, cargando, error }: DirectorioProps) {
  if (cargando) {
    return (
      <section className="footer__directorio mb-4 pb-4 border-bottom border-light border-opacity-25">
        <div className="container-fluid px-0">
          <h2 className="h5 fw-semibold text-white mb-3">Equipo</h2>
          <p className="text-white opacity-75 mb-0" role="status">
            Cargando equipo…
          </p>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="footer__directorio mb-4 pb-4 border-bottom border-light border-opacity-25">
        <div className="container-fluid px-0">
          <h2 className="h5 fw-semibold text-white mb-3">Equipo</h2>
          <div className="alert alert-danger mb-0" role="alert">
            {error}
          </div>
        </div>
      </section>
    )
  }

  if (equipo.length === 0) {
    return (
      <section className="footer__directorio mb-4 pb-4 border-bottom border-light border-opacity-25">
        <div className="container-fluid px-0">
          <h2 className="h5 fw-semibold text-white mb-3">Equipo</h2>
          <p className="text-white opacity-75 mb-0">
            Todavía no hay integrantes cargados.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="footer__directorio mb-4 pb-4 border-bottom border-light border-opacity-25">
      <div className="container-fluid px-0">
        <h2 className="h5 fw-semibold text-white mb-3">Equipo</h2>
        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-3">
          {equipo.map((integrante) => (
            <TarjetaContacto key={integrante.id} integrante={integrante} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Directorio
