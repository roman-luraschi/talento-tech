import { useEffect, useState } from 'react'
import type { Persona } from '../types/nosotros'
import TarjetaContacto from './TarjetaContacto'

function Directorio() {
  const [nosotros, setNosotros] = useState<Persona[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const load = async (): Promise<void> => {
      setCargando(true)
      setError(null)

      try {
        const response = await fetch('/data/nosotros.json')
        if (!response.ok) {
          throw new Error('No se pudo cargar el directorio del equipo.')
        }
        const data: unknown = await response.json()
        if (!Array.isArray(data)) {
          throw new Error('El formato del listado no es válido.')
        }
        if (!cancelled) {
          setNosotros(data as Persona[])
        }
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Error inesperado al cargar el equipo.'
        if (!cancelled) {
          setError(message)
        }
      } finally {
        if (!cancelled) {
          setCargando(false)
        }
      }
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [])

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

  return (
    <section className="footer__directorio mb-4 pb-4 border-bottom border-light border-opacity-25">
      <div className="container-fluid px-0">
        <h2 className="h5 fw-semibold text-white mb-3">Equipo</h2>
        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4">
          {nosotros.map((persona) => (
            <TarjetaContacto key={persona.id} persona={persona} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Directorio
