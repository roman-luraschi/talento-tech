import { useId } from 'react'
import { useStore } from '../context/StoreContext'
import type { Product } from '../types/store'
import '../css/TarjetaProducto.css'

export interface TarjetaProductoProps {
  product: Product
  imagenAlt?: string
}

const priceFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  minimumFractionDigits: 2,
})

const starPath =
  'M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z'

function TarjetaProducto({ product, imagenAlt }: TarjetaProductoProps) {
  const { addToCart, toggleFavorite, isFavorite } = useStore()
  const esFavorito = isFavorite(product.id)

  const generatedId = useId()
  const tituloId = `tarjeta-producto-titulo-${generatedId.replace(/:/g, '')}`
  const altText = imagenAlt ?? product.name
  const inicial = product.name.trim().charAt(0).toUpperCase()

  function anadirAlCarrito() {
    addToCart(product)
  }

  function marcarComoFavorito() {
    toggleFavorite(product.id)
  }

  const favoritoLabel = esFavorito
    ? `Quitar de favoritos: ${product.name}`
    : `Marcar como favorito: ${product.name}`

  return (
    <article className="tarjeta-producto" aria-labelledby={tituloId}>
      <div className="tarjeta-producto__media">
        <span className="tarjeta-producto__inicial" aria-hidden>
          {inicial}
        </span>
        <img
          src={product.imageUrl}
          alt={altText}
          className="tarjeta-producto__img"
          width={400}
          height={400}
          loading="lazy"
        />
      </div>
      <div className="tarjeta-producto__body">
        <h3 id={tituloId} className="tarjeta-producto__titulo">
          {product.name}
        </h3>
        <p className="tarjeta-producto__precio">{priceFormatter.format(product.price)}</p>
        <div className="tarjeta-producto__acciones">
          <button type="button" className="tarjeta-producto__anadir" onClick={anadirAlCarrito}>
            Añadir producto
          </button>
          <button
            type="button"
            className={
              esFavorito
                ? 'tarjeta-producto__favorito tarjeta-producto__favorito--activo'
                : 'tarjeta-producto__favorito'
            }
            aria-label={favoritoLabel}
            aria-pressed={esFavorito}
            onClick={marcarComoFavorito}
          >
            <svg
              className="tarjeta-producto__estrella"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              aria-hidden
              focusable="false"
            >
              <path
                d={starPath}
                fill={esFavorito ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </article>
  )
}

export default TarjetaProducto
