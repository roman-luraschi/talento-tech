import type { Persona } from '../types/nosotros'

interface TarjetaContactoProps {
  persona: Persona
}

function TarjetaContacto({ persona }: TarjetaContactoProps) {
  return (
    <div className="col">
      <article className="card h-100 shadow-sm border-0">
        <img
          src={persona.foto}
          className="card-img-top footer__directorio-avatar"
          alt={`Foto de ${persona.nombre}`}
          loading="lazy"
          width={200}
          height={200}
        />
        <div className="card-body d-flex flex-column">
          <h3 className="card-title h5 mb-1">{persona.nombre}</h3>
          <p className="text-secondary small mb-2">{persona.puesto}</p>
          <a className="mt-auto small" href={`mailto:${persona.email}`}>
            {persona.email}
          </a>
        </div>
      </article>
    </div>
  )
}

export default TarjetaContacto
