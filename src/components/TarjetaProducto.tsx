import { useId, type MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FaShoppingCart, FaStar } from 'react-icons/fa'
import { useStore } from '../context/StoreContext'
import type { Product } from '../types/store'
import { BotonCompra, BotonFavorito } from '../styles/buttons'
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

function TarjetaProducto({ product, imagenAlt }: TarjetaProductoProps) {
  const { addToCart, toggleFavorite, isFavorite } = useStore()
  const esFavorito = isFavorite(product.id)

  const generatedId = useId()
  const tituloId = `tarjeta-producto-titulo-${generatedId.replace(/:/g, '')}`
  const altText = imagenAlt ?? product.name
  const inicial = product.name.trim().charAt(0).toUpperCase()
  const productUrl = `/producto/${product.id}`

  function anadirAlCarrito(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    event.stopPropagation()
    addToCart(product)
    toast.success(`${product.name} agregado al carrito`)
  }

  function marcarComoFavorito(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    event.stopPropagation()
    const estabaEnFavoritos = esFavorito
    toggleFavorite(product.id)
    if (estabaEnFavoritos) {
      toast.info(`${product.name} quitado de favoritos`)
    } else {
      toast.success(`${product.name} agregado a favoritos`)
    }
  }

  const favoritoLabel = esFavorito
    ? `Quitar de favoritos: ${product.name}`
    : `Marcar como favorito: ${product.name}`

  return (
    <article className="tarjeta-producto h-100" aria-labelledby={tituloId}>
      <Link
        to={productUrl}
        className="tarjeta-producto__link"
        aria-labelledby={tituloId}
      >
        <div className="tarjeta-producto__media">
          {product.badge ? (
            <span className="tarjeta-producto__badge">{product.badge}</span>
          ) : null}
          <span className="tarjeta-producto__inicial" aria-hidden>
            {inicial}
          </span>
          <img
            src={product.imageUrl}
            alt={altText}
            className="tarjeta-producto__img img-fluid"
            width={400}
            height={400}
            loading="lazy"
          />
        </div>
        <div className="tarjeta-producto__body">
          <h3 id={tituloId} className="tarjeta-producto__titulo">
            {product.name}
          </h3>
          <p className="tarjeta-producto__precio">
            {priceFormatter.format(product.price)}
          </p>
        </div>
      </Link>
      <div className="tarjeta-producto__acciones">
        <BotonCompra type="button" onClick={anadirAlCarrito}>
          <FaShoppingCart aria-hidden />
          Añadir
        </BotonCompra>
        <BotonFavorito
          type="button"
          $activo={esFavorito}
          aria-label={favoritoLabel}
          aria-pressed={esFavorito}
          onClick={marcarComoFavorito}
        >
          <FaStar aria-hidden />
        </BotonFavorito>
      </div>
    </article>
  )
}

export default TarjetaProducto
