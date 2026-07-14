import type { Integrante } from '../types/equipo'

interface TarjetaContactoProps {
  integrante: Integrante
}

function TarjetaContacto({ integrante }: TarjetaContactoProps) {
  return (
    <div className="col">
      <article className="footer__equipo-card card h-100 border-0">
        <img
          src={integrante.fotoURL}
          className="card-img-top footer__directorio-avatar"
          alt={`Foto de ${integrante.nombre}`}
          loading="lazy"
          width={200}
          height={200}
        />
        <div className="card-body d-flex flex-column">
          <h3 className="card-title h6 mb-1">{integrante.nombre}</h3>
          <p className="footer__equipo-rol small mb-3">{integrante.rol}</p>
          <a
            className="footer__equipo-linkedin mt-auto"
            href={integrante.linkedinURL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Ver LinkedIn
          </a>
        </div>
      </article>
    </div>
  )
}

export default TarjetaContacto
